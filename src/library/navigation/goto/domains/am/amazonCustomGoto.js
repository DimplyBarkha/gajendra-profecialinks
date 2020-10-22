async function goto(gotoInput, parameterValues, context, dependencies) {
  // const extractorContext = gotoInput.context
  const extractorContext = gotoInput.context;
  const zipcode  =  gotoInput.zipcode;

  // strategies can  be  turned on and off
  const fillRateStrategies = {
    variantAPIAppendData: true,
    nonVariantReload: true,
    variantReload: true,
    acceptCookies: true,
    // missingDataRetry has dependants
    missingDataRetry: true,
    // dependant on missingDataRetry
    cleanCookieRetry: true,
    // dependant on missingDataRetry
    salesRankBadgeRetry: true,
    hourlyRetryLimit: false
  };
  console.log('fillRateStrategies: ', fillRateStrategies)

  //input.extractor || 
  const extractor = ''
  //parseInt(input.maxCaptchas) ||
  const MAX_CAPTCHAS =  3
  //parseInt(input.maxSessionRetries) ||
  const MAX_SESSION_RETRIES =  2
  // HOURLY_RETRY_LIMIT is a variable  depending on throughput and proxy pool volumee
  // We may need to expand the "key" to be project&extractor specific beecause projects have custom domain limits
  //parseInt(input.hourlyRetryLimit) ||
  const HOURLY_RETRY_LIMIT =  90000

  let page;
  let captchas = 0;
  let inSessionRetries = 0;
  let lastResponseData;

  // checking for elements on page after goto/captcha/reload/etc.
  const pageContext = async () => {
    return await extractorContext.evaluate(() => {
      console.log('extractorContext.evaluate');
      const selectors = {
        hasVariants: 'div[id*="variation_"] ul, div[id*="variation_"] option',
        hasProdDetails: '#prodDetails, #detailBullets_feature_div',
        hasSalesRank: '#detailBullets_feature_div a[href*="bestsellers"], #detailBullets a[href*="bestsellers"], #prodDetails a[href*="bestsellers"], #SalesRank',
        isProductPage: 'link[rel*=canonical][href*="/dp/"]',
        isReviewsPage: 'link[rel*=canonical][href*=product-reviews]',
        isBestSellerPage: 'link[rel*=canonical][href*="/zgbs/"]',
        isSearchPage: '#search',
        hasSalesRankBadge: '#ppd i[class*="best-seller-badge"]',
        isCaptchaPage: 'img[src*="/captcha/"]',
        hasAplus: '#aplus',
        hasProductDescription: '#productDescription',
        hasShippingDetails: '#contextualIngressPtLabel_deliveryShortLine',
        hasCookieAcceptRequest: '#sp-cc-accept',
        hasDogsofAmazon: 'img[alt*="Dogs of Amazon"]',
        is400Page: 'a[href*="404_logo"]',
        is500Page: 'img[src*="500-title"], a[href*="503_logo"], a img[src*="503.png"], a[href*="ref=cs_503_link"]',
        hasTitle: 'title, #gouda-common-atf h1',
      };

      const elementChecks = {};

      for (var prop in selectors) {
        if (document.querySelector(selectors[prop])) {
          elementChecks[prop] = true;
        } else { elementChecks[prop] = false; }
      }
      elementChecks["windowLocation"] = window.location
      return elementChecks;
    });
  };

  // checking for blank pages and reloads if blank (data dropped)
  const pageContextCheck = async (page) => {
    console.log('pageContextCheck', page)
    if (Object.entries(page).filter(item=>item[0]!="windowLocation").filter(item=>item[1] === true).length  === 0) {
      extractorContext.counter.set('dropped_data', 1);
      await extractorContext.reload();
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Waiting for page to reload');
      return await solveCaptchaIfNecessary(await pageContext());
    }
    return page;
  };

  // redshift element counter
  const counter = async (page) => {
    if(page.isProductPage){
      const counts = [];
      const fields = [
        { key: 'aplus', boolean: page.hasAplus },
        { key: 'prodDesc', boolean: page.hasProductDescription },
        { key: 'prodDetails', boolean: page.hasProdDetails },
        { key: 'shipDetails', boolean: page.hasShippingDetails },
        { key: 'salesRank', boolean: page.hasSalesRank },
      ];
      for (const { key, boolean } of fields) {
        counts.push({ key, inc: boolean ? 1 : 0 });
      }
      counts.forEach(({ key, inc }) => {
        extractorContext.counter.set(key, inc);
      });
    }
  };

  const setZip = async (zip) => {
    if(zip){
      const apiZipChange = await extractorContext.evaluate(async (zipcode) => {
        const body = `locationType=LOCATION_INPUT&zipCode=${zipcode}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`;
        const response = await fetch('/gp/delivery/ajax/address-change.html', {
          headers: {
            accept: 'text/html,*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'x-requested-with': 'XMLHttpRequest',
          },
          body,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });
        return response.status === 200;
      }, zipcode);

      const onCorrectZip = await extractorContext.evaluate((zipcode) => {
        const zipText = document.querySelector('div#glow-ingress-block')
        return zipText ? zipText.textContent.includes(zipcode) : false
      }, zipcode);

      if(!onCorrectZip){
        if(!apiZipChange){
          throw new Error('API zip change failed');
        } else {
          await extractorContext.reload();
          page = await pageContextCheck(await pageContext());
          await solveCaptchaIfNecessary(page);
        }
      }
    }
  }

  // calls refresh API and appends data to the page that doesnt already exist
  const appendData = async (page) => {
    return await extractorContext.evaluate(async (page) => {
      const getParams = async () => {
        const paramLocators = [
          'pgid',
          'sid',
          'rid',
          'ptd',
          'storeID',
          'parent_asin',
          'current_asin',
        ];
        const params = {};
        const raw = document.evaluate("//script[contains(@language,'JavaScript') and contains(text(), 'pgid')  and  contains(text(), 'current_asin')]", document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
        if (raw) {
          paramLocators.forEach(param => {
            if (raw.innerText.includes(param)) {
              const regex = new RegExp(`${param}":"([^"]+)`, 's');
              const paramMatch = raw.innerText.match(regex);
              const paramClean = paramMatch && paramMatch.length > 1 ? paramMatch[1] : false;
              if (paramClean) {
                params[`${param}`] = paramClean;
              }
            }
          });
        }
        console.log('params', params);
        return params;
      };
      const params = await getParams();
      try {
        if (Object.keys(params).length === 7) {
          let url;
          if (page.windowLocation.hostname.includes('com')) {
            url = `https://${page.windowLocation.hostname}/gp/page/refresh?acAsin=${params.current_asin}&asinList=${params.current_asin}&auiAjax=1&dpEnvironment=softlines&dpxAjaxFlag=1&ee=2&enPre=1&id=${params.current_asin}&isFlushing=2&isP=1&isUDPFlag=1&json=1&mType=full&parentAsin=${params.parent_asin ? params.parent_asin : params.current_asin}&pgid=${params.pgid}&psc=1&ptd=${params.ptd}&rid=${params.rid}=1&sCac=1&sid=${params.sid}&storeID=${params.storeID}&triggerEvent=Twister&twisterView=glance`;
          } else {
            url = `https://${page.windowLocation.hostname}/gp/twister/ajaxv2?acAsin=${params.current_asin}&sid=${params.sid}&ptd=${params.ptd}&sCac=1&twisterView=glance&pgid=${params.pgid}&rid=${params.rid}&dStr=size_name&auiAjax=1&json=1&dpxAjaxFlag=1&isUDPFlag=1&ee=2&parentAsin=${params.parent_asin ? params.parent_asin : params.current_asin}&enPre=1&dcm=1&udpWeblabState=T1&storeID=${params.storeID}&ppw=&ppl=&isFlushing=2&dpEnvironment=hardlines&asinList=${params.current_asin}&id=${params.current_asin}&mType=full&psc=1`;
          }

          const parseResponse = (blob) => {
            const dataBlobs = blob.split('&&&').map(part => part.trim()).filter(part => part.length > 0).map(part => JSON.parse(part));
            return dataBlobs;
          };

          const dataRaw = await fetch(url)
            .then(response => response.text())
            .then(blob => parseResponse(blob));

          console.log('# elements attempting to append: ', dataRaw.length);

          dataRaw.forEach(part => {
            const element = document.getElementById(Object.keys(part.Value.content)[0]);
            if (element) {
              //element.innerHTML = Object.values(part.Value.content)[0];
            } else {
              const div = document.createElement('div');
              div.setAttribute('id', Object.keys(part.Value.content)[0]);
              div.innerHTML = Object.values(part.Value.content)[0];
              const  appendAtBottom = document.getElementById('a-page');
              if(appendAtBottom){
                appendAtBottom.insertBefore(div, document.getElementById('navFooter'))
              }else{console.log('couldnt find a good place to append data')}
            }
          });
          return true;
        } else { return false; }
      } catch (err) {
        console.log('append data try  catch fail', err);
        return false;
      }
    }, page);
  };

  // checks internal expected API
  const getShouldHaveData = async (url) => {
    try {
      const apiUrl = 'https://moorhe2t18.execute-api.us-east-1.amazonaws.com/prod/?url=' + encodeURIComponent(url || gotoInput.url);
      const res = await Promise.race([
        extractorContext.fetch(apiUrl, { timeout: 1e3 }),
        new Promise((r, j) => setTimeout(j, 1e3)),
      ]);
      const data = await res.json();
      if (data) {
        console.log('expectedAPI: ', data);
        return data;
      }
      return { details: 0 };
    } catch (err) {
      console.error('shouldHave:error', err);
      return { details: 0 };
    }
  };

  const solveCaptcha = async () => {
    console.log('isCaptcha');

    // pageId = await extractorContext.getPageId();

    await extractorContext.solveCaptcha({
      type: 'IMAGECAPTCHA',
      inputElement: 'form input[type=text][name]',
      imageElement: 'form img',
      autoSubmit: true,
    });

    console.log('solved captcha, waiting for page change');
    // await extractorContext.waitForNextPage(30);
    //port
    await extractorContext.waitForNavigation()

    console.log('Captcha vanished');

    const page = await pageContext();
    return page;
  };

  const solveCaptchaIfNecessary = async (page) => {
    if (page.isCaptchaPage && captchas < MAX_CAPTCHAS) {
      captchas++;
      return await solveCaptcha();
    }
    return page;
  };

  const acceptCookies = async () => {
    console.log('page.hasCookieAcceptRequest: ', 'true');
    await extractorContext.click('#sp-cc-accept');
    console.log('Waiting for cookie modal to close');
  };

  const acceptCookiesIfNecessary = async (page) => {
    if (page.hasCookieAcceptRequest && fillRateStrategies.acceptCookies) {
      console.log('Checking for cookie accept request');
      await acceptCookies();
      console.log('Done checking for cookie accept request');
      page = await pageContext();
      console.log('page:', page);
    }
    return page;
  };

  // used for key in hourly retry API
  const currDateHour = async () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const hour = dateObj.getUTCHours();
    return `${year}_${month}_${day}_${hour}`;
  };

  const hourlyRetryIncrement = async () => {
    if(extractor && fillRateStrategies.hourlyRetryLimit){
      try {
        const key = `${extractor}_${await currDateHour()}`;
        const apiUrl = `https://89lnzah832.execute-api.us-east-1.amazonaws.com/prod/${key}/plus`;
        const res = await Promise.race([
          extractorContext.fetch(apiUrl, { timeout: 1e3 }),
          new Promise((r, j) => setTimeout(j, 1e3)),
        ]);
        const data = await res.json();
        console.log('hourlyRetryIncrement', data);
      } catch (err) {
        console.error('hourlyRetryIncrement:error', err);
      }
    }
  };

  const getHourlyRetryCount = async () => {
    if(extractor && fillRateStrategies.hourlyRetryLimit){
      try {
        const key = encodeURIComponent(`${extractor}_${await currDateHour()}`);
        const apiUrl = `https://89lnzah832.execute-api.us-east-1.amazonaws.com/prod/${key}`;
        const res = await Promise.race([
          extractorContext.fetch(apiUrl, { timeout: 1e3 }),
          new Promise((r, j) => setTimeout(j, 1e3)),
        ]);
        const data = await res.json();
        if (data) {
          const retriesThisHour = data.counter;
          console.log(`retriesThisHour: ${extractor}_${await currDateHour()}`, retriesThisHour);
          return retriesThisHour;
        }
        return HOURLY_RETRY_LIMIT;
      } catch (err) {
        console.error('hourlyRetry:error', err);
        return HOURLY_RETRY_LIMIT;
      }
    }
    return 0
  };

  const retryContext = async () => {
    const retry = extractorContext.retryContext;
    const context = {
      isLastRetry: parseInt(retry.maxRetries) <= parseInt(retry.retryNumber),
      isRetry: parseInt(retry.retryNumber) > 0,
    };
    return context;
  };

  const hasSalesRankBadgeAndNoData = (page) => {
    if (fillRateStrategies.salesRankBadgeRetry && page.hasSalesRankBadge && !page.hasSalesRank) {
      return true;
    }
    return false;
  };

  const handlePage = async (page, lastResponseData) => {
    console.log('HANDLING PAGE');
    // checking for blank  page and  reloading
    page = await pageContextCheck(page);

    page = await solveCaptchaIfNecessary(page);
    // solve 2 captchas if needed
    if (page.isCaptchaPage) {
      page = await solveCaptchaIfNecessary(page);
    }
    if (page.isCaptchaPage) {
      console.log('checking captcha', page);
      // we failed to solve the CAPTCHA or a second captcha was thrown
      extractorContext.reportBlocked(lastResponseData.status, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
    }

    if (lastResponseData.status === 503 || page.is500Page) {
      console.log('getting  503 pageId');
      // pageId = await extractorContext.getPageId();

      console.log('Clicking 503 image');
      await extractorContext.click('a img[src*="503.png"], a[href*="ref=cs_503_link"], a img[src*="error/500-title"]');

      console.log('Waiting for page to reload on homepage using 503  pageId');
      // await extractorContext.waitForNextPage(30);
      //port
      await extractorContext.waitForNavigation()

      page = await pageContext();
      if (page.is500Page) {
        // we failed to solve the CAPTCHA or a second captcha was thrown
        extractorContext.reportBlocked(lastResponseData.status, 'Blocked: Could not work around 503');
      }

      page = await solveCaptchaIfNecessary(page);
      if (page.isCaptchaPage) {
        // we failed to solve the CAPTCHA or a second captcha was thrown
        extractorContext.reportBlocked(lastResponseData.status, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
      }

      console.log('Go to some random page');
      const clickedOK = await extractorContext.evaluate(function () {
        const links = Array.from(document.querySelectorAll('a[href*="/dp/"]'));
        if (links.length === 0) {
          return false;
        }
        links[Math.floor(links.length * Math.random())].click();
        return true;
      });

      if (!clickedOK) {
        console.log('Could not click a product, aborting... :/');
        return await pageContext();
      }

      await new Promise(r => setTimeout(r, 2000));

      console.log('Going back to desired page');
      lastResponseData = await extractorContext.goto(gotoInput.url, {
        checkBlocked: false
      });

      console.log('lastResponseData: ', lastResponseData);
      page = await pageContext();
      console.log('page: ', page);
    }

    if (lastResponseData.status === 404 || lastResponseData.status === 410 || page.is400Page || (page.hasDogsofAmazon && !page.is500Page)) {
      return false;
    }

    if (lastResponseData.status !== 200) {
      return extractorContext.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
    }

    await extractorContext.checkBlocked();

    page = await acceptCookiesIfNecessary(page);

    if (lastResponseData.url.includes('elasticbeanstalk') || lastResponseData.url.includes('www.primevideo.com')) {
      extractorContext.counter.set('primevideo', 1);
    }

    return page;
  };

  const run = async (user_agent) => {
    // extractorContext.enableNetworkDebugger();
    // redshift health counters set to 0
    extractorContext.counter.set('task', 0)
    extractorContext.counter.set('expected', 0)
    extractorContext.counter.set('primevideo', 0)
    extractorContext.counter.set('refresh', 0)
    extractorContext.counter.set('append', 0)

    // options used for all goto's
    await extractorContext.setUserAgent(user_agent)
    await extractorContext.setJavaScriptEnabled(true)
    await extractorContext.setCssEnabled(false)

    lastResponseData = await extractorContext.goto(gotoInput.url, {
      checkBlocked: false
    });
    console.log('lastResponseData: ', lastResponseData);

    // get all needed selectors  on  page as booleans as pageContext
    // solve  captcha, handle 503, accept cookies, etc

    console.log('about to  handle page')
    page = await handlePage(await pageContext(), lastResponseData);
    console.log('page handled: ', page);
    if (!page) {
      console.log('attempting to return 404', lastResponseData);
      return;
    }

    const retry = await retryContext();
    console.log('retryContextAPI: ', retry);
    const shouldRetry = (!retry.isLastRetry && await getHourlyRetryCount() < HOURLY_RETRY_LIMIT)

    const shouldHaveData = await getShouldHaveData(gotoInput.url)
    console.log('blank page check')
    page = await pageContextCheck(await pageContext())
    console.log('blank page check done :', page)

    // API append if variants exist and prodDetails expected, otherwise reload
    if (page.isProductPage && !!parseInt(shouldHaveData.details) && !page.hasProdDetails) {
      if (page.hasVariants && fillRateStrategies.variantAPIAppendData) {
        console.log('append ------>', 'Missing prodDetails when API history says it is expected, and variants exist.')
        if (await appendData(page)) {
          extractorContext.counter.set('append', 1)
          console.log('appended data to bottom of page')
        } else {
          console.log('failed to append data')
        }
        page = await pageContext();
        console.log('page update after append: ', page);
      } else if (page.hasVariants && fillRateStrategies.variantReload && !page.hasProdDetails && inSessionRetries < MAX_SESSION_RETRIES) {
        console.log('reload ------>', 'Missing prodDetails when API history says it is expected, and variants exist.');
        inSessionRetries += 1;
        extractorContext.counter.set('refresh', 1);
        await extractorContext.reload();
        await new Promise(r => setTimeout(r, 2000));
        console.log('Waiting for page to reload');
        // await extractorContext.waitForNextPage(30);
        //port
        await extractorContext.waitForNavigation()
        console.log('Page reloaded');
        page = await handlePage(await pageContext(), lastResponseData);
        console.log('page handled: ', page);
      }
      if (!page.hasVariants && fillRateStrategies.nonVariantReload) {
        console.log('reload ------>', 'Missing prodDetails when API history says it is expected, and variants  do not exist.');
        extractorContext.counter.set('refresh', 1);
        await extractorContext.reload();
        await new Promise(r => setTimeout(r, 2000));
        console.log('Waiting for page to reload');
        // await extractorContext.waitForNextPage(30);
        // port
        await extractorContext.waitForNavigation()
        console.log('Page reloaded');
        page = await handlePage(await pageContext(), lastResponseData);
        console.log('page handled: ', page);
      }
    }

    await counter(page);

    if (!!parseInt(shouldHaveData.details) || page.hasProdDetails) {
      extractorContext.counter.set('expected', 1);
    }
    // check for blank  page
    console.log('final blank page check');
    page = await pageContextCheck(await pageContext());
    console.log('final blank page check done :', page);

    // missing  data retry strategies
    if (fillRateStrategies.missingDataRetry && page.isProductPage && shouldRetry && !page.hasProdDetails) {
      if (parseInt(shouldHaveData.details)) {
        console.log('error ------>', 'Missing prodDetails when API history says it is expected.');
        throw Error('MISSING_DATA: prodDetails expected');
      }
      if (fillRateStrategies.salesRankBadgeRetry && hasSalesRankBadgeAndNoData(page)) {
        console.log('blocked ------>', 'Missing salesRank when salesRankBadge exists.');
        throw Error('MISSING_DATA: salesRank expected ');
      }
    }
    // checking for blank  page and  reloading
    console.log('task ok');
    extractorContext.counter.set('task', 1);
  };

  const allUserAgentString = [
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3966.3 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3964.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3965.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3962.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3968.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3962.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3963.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3962.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3968.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 Edg/80.0.361.109"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3498.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 - Win 10"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/0d7US9YD-23"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Edg/80.0.361.48"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 - Ravi"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 AVG/80.0.3573.124"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.84 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/4bqhuc8o-14"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 SECSSOBrowserChrome"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; FreeBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 OPR/67.0.3575.105"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3964.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3963.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3968.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3966.3 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3964.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/GVB3X88f-12"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/N1RRIh6H-28"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Whale/2.7.98.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; FreeBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/ULXrAQBE-12"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 320ad9f7bb099f0ae10da3f88b80f08a81ad7a14"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64; MDDRJS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; openSUSE; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.86 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; OpenBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97 (Edition Yx 03)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.123 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3571.123"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.96 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36/LhaZyHSu-45"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.53 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 NetHelper70"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.96 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS aarch64 12739.111.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/eVtdwfpw-4"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.99.20 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/LuE8SY2d-10"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Edg/80.0.361.66"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; ; MDDRJS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 YaBrowser/20.3.2.238 Yowser/2.5 Yptp/1.58 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/A2657A"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.97 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.78 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/yEYL3ZFS-38"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 OPR/67.0.3575.28 (Edition beta)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 ObservePoint"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/RtVQWT9t-23"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Edg/80.0.361.50"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.99.22 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.142 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3980.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3764.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3975.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 Edg/80.0.361.54"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.79"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137 (Edition Yx 05)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3955.4 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3965.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3962.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3968.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3962.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3963.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3962.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3968.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3964.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3963.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3968.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.104 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3952.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36 Avast/80.0.3382.43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3764.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3453.116"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; OS ROSA; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/hihLKFKs-36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3969.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Whale/2.7.97.12 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.89 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/9E2A66"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3505.123"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; BPL-USER) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3575.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/J7WO3LEK-50"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3498.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 Edg/80.0.361.111"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/Yql5kQqS-26"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36/h3E6l2Li-43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.83 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 ineTagenT"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 OPR/67.0.3575.28 (Edition beta)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 ADFS-SSO-DS"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 OPR/67.0.3575.53 (Edition Yx)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/rzzOEsRs-43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3974.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3955.4 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.78 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 YaBrowser/20.3.0.1217 Yowser/2.5 Yptp/1.46 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3975.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.22 anonymized by Abelssoft 787337546"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3405.100"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/MflWRFhK-3"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3504.122"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/D2F4C1"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.22 anonymized by Abelssoft 931895522"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.79"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; FreeBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.107 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.22 anonymized by Abelssoft 2000192563"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.133 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/jvkkKtQI-5"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.137 Safari/537.36 SWRInfo: 3026::c41@stchristophershove.org.uk;"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3403.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/Z5pz4j1n-16"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.104 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 CCleaner/80.0.3459.119"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3503.123"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.106.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.118 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 5gDzFyT4#LAy%3uC"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/He3rj6nN-20"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/ZKNEYIla-11"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3957.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/tlkU5bg3-4"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/V2Nofc9u-8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3955.4 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4b6) AppleWebKit/605.1.15  (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Brave/1.4.96"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/mU8Lg1T3-15"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 NetHelper70"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3503.123"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; OpenBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 AVG/80.0.3477.118"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/sTPP4XUF-44"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/9tbUqlEQ-0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 FirePHP/4Chrome"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.86 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.78 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Edg/80.0.361.103"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 OPT/2.3"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/2juEvpXE-34"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.86 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/fZr8Zd4d-18"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3403.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.22 anonymized by Abelssoft 2078697129"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 OPR/67.0.3575.31"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3946.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3764.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686 (x86_64)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36.0 Win64.r.20TL13"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.103 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/79C599"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.98.24 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.144 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.89 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/Cz7irqbd-36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3570.122"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/EUDxzwQz-15"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.22 anonymized by Abelssoft 2000192563"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.78 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 SECSSOBrowserChrome"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3960.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.91 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.107 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.99.20 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.125 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/UFaAnoeO-18"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.107 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/JpxZXh1k-9"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 YaBrowser/20.3.0.1217 Yowser/2.5 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3955.4 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.83 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/BuLB976k-1"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.91 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.28311 Safari/537.36 Sparrow"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/mT7u6pJ9-24"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.163.967"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 NetHelper70"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/1cziNXbh-0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.130 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.67 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 [linceweb@Dev:Saulo]"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.4103.60 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 MicroAdBot/1.1 (https://www.microad.co.jp/contact/)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3468.116"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Edg/80.0.361.62"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.143 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/44FF7D"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 cpu7yI9A2A"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.118 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3621.133"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Edg/80.0.361.48"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Ionic/2.16.8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Ionic/2.16.8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36 Avast/80.0.3333.43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/XtowIcIZ-10"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/f4O7Xn8e-45"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/86M3CGtN-33"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Ionic/2.16.8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36/0vtEMEeB-26"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.141 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.118 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3983.280.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3626.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3625.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.28390 Safari/537.36 Sparrow"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3468.116"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/Cdn8Ptrh-50"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.107 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.83 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3406.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3626.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/4pZBrJqx-30"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/UEovH5jx-20"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.90 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 FS"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/UK5EwWhU-34"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3361.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.98.27 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.96 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3954.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3621.133"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97 (Edition Yx)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 NetHelper70"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.120 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.93 Safari/537.36 OPR/55.3.2166.60"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/null/null/null/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3510.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/1hjwpKVD-2"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/pWcXRL5N-0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/0eOwJnDc-12"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3985.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.125 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.119 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3904.70 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115 (Edition Yx)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/RR4hel52-34"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.81 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/BNsmx0OG-29"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115 (Edition Yx)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.96 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 sibvaleo-developer"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3946.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3765.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/C3TpsPm3-10"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3764.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 SECSSOBrowserChrome"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/ar8D83ZT-34"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.144 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3968.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/vP1qSb1w-19"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.96 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/EAJ4AV74-30"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.86 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36/uDbbTap0-35"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/khIVJmLE-21"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3360.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Edg/80.0.361.53"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/DcPjsvUY-50"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/Zwbc9uCO-17"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137 (Edition Yx 03)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/f3RGj5ZX-44"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.81 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Ionic/2.16.8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/cQPhzTz8-52"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/HaswLdhG-2"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/4fnmoRzC-20"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115 (Edition Yx 03)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/kKr0Yv8b-54"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/gbCTs2Rq-3"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.93 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; openSUSE; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/2VDHRlKd-35"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 CCleaner/80.0.3459.119"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3506.122"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; ; NCLIENT50_AAP0D48C666F42) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 OPR/67.0.3575.31"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; OpenBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/O2aS51aW-6"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3570.122"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/null/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 AVG/80.0.3408.102"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3974.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3452.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.91 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.119 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3970.5 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137 (Edition Yx 03)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/mwPdNvQ5-59"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.131 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/80.0.3987.163 Safari/537.36/HYBnw03R-9"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3500.116"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3620.132"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 encors/0.0.6"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3969.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3625.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.80 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115 (Edition Yx 03)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/WtwDJQUb-9"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.92 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 encors/0.0.6"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/OTjS1NSa-45"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 OPR/67.0.3575.53"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.66 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3625.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/en8cLYUD-32"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.118 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/Qeba36Iw-15"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/98rbiAZB-52"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.90 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/xA7AfpOq-40"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/9stBohUR-24"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Whale/2.7.97.10 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.95 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.102 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/bTlwQjf4-15"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64; MDDRJS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/pWhygjQH-59"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 Edg/80.0.361.56"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.94 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 BriskBard/1.8.5"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS armv7l 12739.94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.137 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 YaBrowser/20.3.0.1217 Yowser/2.5 Yptp/1.58 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/kKr0Yv8b-54"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.98.19 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36 Avast/80.0.3379.43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 Kinza/6.1.8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.53 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.86 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.118 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3503.123"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 OPR/67.0.3575.105"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/605.1.15"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/yhk7QZ7T-4"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/xgR7F461-42"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.144 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/4C3RkHep-38"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/V7T1ySMI-8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3973.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3765.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 AVG/80.0.3765.151"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.98.19 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 CCleaner/80.0.3764.152"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/mXqDRsEy-20"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.28808 Safari/537.36 Sparrow"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.80 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.134 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/of2XUGFS-0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/R7ubIPzJ-53"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.59.9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.102 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36/uObxrA9v-50"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/9m1atXuL-59"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/s8yAAhIU-24"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/InwNe8Y9-0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 Kinza/6.1.2"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3963.0 Safari/537.36 Chrome-Lighthouse"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Pasco"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 YourWap/1.16"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3961.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3437.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3983.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/uUMw8Lia-0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/k14lELyT-21"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/e05urzEA-31"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/null/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Edg/80.0.361.48"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/IqNqKkXe-59"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/p1cK7Ktg-26"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/vErREQA5-23"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.141 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/auTpajw9-14"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.166.271"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; OpenBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/HYb7eIej-25"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 CCleaner/80.0.3458.119"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 HM_PROD_MAN"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.142 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3970.5 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115 (Edition Yx 05)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/KVmSjIdU-28"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/09jf1MKk-8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 FirePHP/4Chrome"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; AMD Mac OS X 11_1_2; en-US) AppleWebKit/537.75 (KHTML, like Gecko) Chrome/80.0.3865.90 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/QaMgsVzb-58"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3202.9 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/pkAsFdYq-57"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/OY3HEhyG-5"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 Edg/80.0.361.109"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3626.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/kZFJhswI-44"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/IoMfF5ct-50"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/C3EA64"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3360.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.84 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Whale/2.7.97.10 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/51C8FA"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3453.116"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/YfCmF2SI-9"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/0xVv0ViZ-20"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3970.5 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Edg/80.0.361.53"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/K0DR2b0w-30"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.95 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; ; NCLIENT50_AAP0C24D18CCE1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 CCleaner/80.0.3458.119"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3967.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/oaVOR4PX-18"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.107 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/F6D619"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3620.132"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Edg/80.0.361.50"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 AVG/80.0.3507.124"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/xY1t9bpW-48"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.123 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/wmzRWT4P-20"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/605.1.15"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3990.90 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Whale/2.7.97.12 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.28652 Safari/537.36 Sparrow"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/WJVZLlnB-38"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.98 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36/ROigMNUf-14"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/pe5NfuW6-17"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3983.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3493.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/zGGFcgIz-59"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3500.116"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3469.77 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/94C0F3"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.28808 Safari/537.36 Sparrow"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 OPR/67.0.3575.53"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.121 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.130 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.66 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/zL5JQmCv-48"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/dXNaqwtd-55"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.165.802"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3947.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.93 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/cChPpXMy-40"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.112 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.81 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3764.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/crXLci9s-47"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.83 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 AVG/80.0.3623.134"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 OPR/67.0.3575.53"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.82 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686 (x86_64)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.66 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/TvH7CNBY-36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.80 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.89 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 Kinza/6.1.7"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 OPR/67.0.3575.130"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.118 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/rjW0HuHd-32"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/5heYN7Xl-7"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/j1GvhNvG-27"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 OPR/54.2.2356.16"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.92 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 AVG/80.0.3624.134"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/rrCXFNVJ-21"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.4150.1 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115 (Edition Yx 03)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.98.27 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.140 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/TG8hYOOM-23"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/D07A5D"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3575.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 OPR/67.0.3575.115"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 YaBrowser/20.3.0.1217 Yowser/2.5 Yptp/1.56 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.97 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 CCleaner/80.0.3411.103"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 Edg/80.0.361.109"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.93.2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3986.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3620.132"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.144 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/a33gDCoL-26"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.91 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/SgSVh9Uq-30"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/a5vBHj8a-37"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.66 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.102 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/EeERNkgL-6"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3976.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Mozilla/5.0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.12.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.18 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/Lwy3PQNG-8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.144 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.22 anonymized by Abelssoft 883653492"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.95 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 CCleaner/80.0.3410.103"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 OPR/67.0.3575.78"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 ADFS-SSO-DS"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/btGlOFMv-25"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3984.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.96 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3955.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.141 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.90 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 09b76e8688500b78d12d9daa7c2d69e3a97ccabb"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Edg/80.0.361.103"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3403.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Edg/80.0.361.51"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3970.5 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/AyXtcWqC-39"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3625.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.105.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36 SPRKApp/5.0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.98 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.129 chimlac/80.0.3987.129 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.104 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3961.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.121 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 SECSSOBrowserChrome"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/ugUAbqjW-30"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686 (x86_64)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.95 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 SECSSOBrowserChrome"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3503.123"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3978.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137 (Edition Yx 03)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.4100.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 OPR/67.0.3575.87"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.104 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.79"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.84 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/fG3eeqjw-44"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.89 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 AVG/80.0.3624.134"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3509.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.163.967"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; OpenBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3978.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/DMZFZ67D-5"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/RQ12Oud2-17"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/iK77j3Ns-22"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.123 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36 Edg/80.0.361.9"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 CCleaner/80.0.3626.135"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.125 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.131 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/6TA8i3ol-27"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 AVG/80.0.3765.151"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3619.133"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/d0J4GTZO-25"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3493.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3620.132"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.53 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.140 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/h3fEcqja-3"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3509.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.22 anonymized by Abelssoft 312848745"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Edg/80.0.361.62"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3509.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.83 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.66 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137 (Edition Yx)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3575.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3437.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.65 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.99.22 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36/dl2gBMZq-47"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3982.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3361.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3570.122"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 CCleaner/80.0.3764.152"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/gfdGfr4g-0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.79"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/uIs7kRYo-28"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3569.123"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.98.19 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/6fNrDGkp-37"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36\\\\x5Cx09Chrome Generic"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3962.2 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.89 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/GyYITQIv-1"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/f8Gv5Grc-44"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 OPR/67.0.3575.130"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.113 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.97 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36; SWREnc: OEtE0e5KZ5d0ZdLGQemt9VZb+mbZYcQ6cgMOCrT0bAKbkvrU1VEAnlY="}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/6UFjYHIU-18"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 YaApp_Android/11.02 YaSearchBrowser/11.02 BroPP/1.0 SA/1 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36\\\\xA0\\\\xA0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Agilis IT"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.133 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3947.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3972.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.166.271"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 AVG/80.0.3478.118"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3360.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3619.133"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 AVG/80.0.3764.151"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/D848AA"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/8t9E4Efu-9"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/80.0.3987.99 Safari/537.31"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3945.130 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.111 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 Aoyou/SWh9KDdOaydFOHg6eTc9O61PKXTouePQdpqR3x6WeDCJufP3aSjdsMc5lg=="}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3453.116"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.118 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 AVG/80.0.3573.124"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36 Edg/80.0.361.54"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 YTranslate"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; ; MDDRJS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.85 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Edg/80.0.361.66"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Avast/80.0.3506.122"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.94 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36 Avast/80.0.3379.43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/n3KYd6Lh-16"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Ionic/2.16.8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 OPR/67.0.3575.31 (Edition Yx)"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 AVG/80.0.3573.124"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; ; NCLIENT50_AAP62D238B1836) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/v4HGrBeC-43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 AVG/80.0.3477.118"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/bn7YC1xi-41"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.112 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Edg/80.0.361.66"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.2550.1 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3764.149"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.28929 Safari/537.36 Sparrow"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.134 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 AVG/80.0.3574.124"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/uo1XnBKd-39"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/htgKs7Gx-56"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3619.133"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3282.167 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/X1U1NmL4-31"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.95 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36/6PrphVU1-46"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/r8pONXMw-35"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/ClugGreD-52"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.112 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3360.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Whale/2.7.97.12 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/RPCetQc2-57"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.111.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 S=022 S=022"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.7 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3949.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 chrome-extension"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 (Chromium GOST) Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/aaZ2iNPX-38"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36 Avast/80.0.3360.101"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.166.271"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3961.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/Lp5fcMwv-36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/3ySM23N6-6"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/loFajWxe-33"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/foBeKyJe-24"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/sY0tnMNq-19"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/24H6Ouks-36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.90 Safari/537.36 OPR/55.0.2277.45"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Edg/80.0.361.57"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3493.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.136 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.90 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/VILZqXL3-24"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/fQrGTEUY-15"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/cEzWON31-35"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/RuDNPdiJ-31"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; CrOS x86_64 12739.94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.137 Safari/537.36 SPRKApp/5.0"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.165.167"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/02ecuDLU-51"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/YYLOaZ08-48"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.104 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 FS"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.158 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.22 anonymized by Abelssoft 580523794"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36/aIbOIqqN-32"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 YaBrowser/20.3.2.238 Yowser/2.5 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/161535"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.16 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36 Avast/80.0.3379.43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.22 anonymized by Abelssoft 32890653"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Avast/80.0.3764.150"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36/null"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/TLS1.2"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Avast/80.0.3619.133"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3964.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.79"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/F51611"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/TEp71NyN-32"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3990.90 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; ; NCLIENT50_AAPF0BB8D79223) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 Ionic/2.16.8"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36/7VWx9kZU-41"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Hola/1.165.802"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3963.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 CCleaner/80.0.3764.152"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36/IkWB6jKG-40"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 Mozilla/5.0 (MacintoshMac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0 sf_debug"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Tesseract/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.95 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.101 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 NetHelper70"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.22 anonymized by Abelssoft 526921539"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36 Avast/80.0.3333.43"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3976.0 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/IuHpEwqu-56/IuHpEwqu-56"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 OPR/67.0.3575.105"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 CCleaner/80.0.3575.125"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.22 anonymized by Abelssoft 1723695880"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36 Avast/80.0.3438.117"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 YaBrowser/20.3.1.195 Yowser/2.5 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.88 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/SGBYFcUh-3"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.84 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 OPR/67.0.3575.137"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.7 Safari/537.36"}',
    },
    {
      config: '{"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36/xGHzvfMy-13"}',
    },
  ];

  let userAgentString = JSON.parse(allUserAgentString[Math.floor(allUserAgentString.length * Math.random())].config).userAgent + ' ' + Math.random().toString(36).substring(2, 15);

  // clean cookie retry in session
  try {
    await run(userAgentString);
    await setZip(zipcode);
  } catch (err) {
    console.error(err);
    const message = err.message ? err.message.includes('MISSING_DATA') : false;
    if (message && fillRateStrategies.cleanCookieRetry && inSessionRetries < MAX_SESSION_RETRIES) {
      inSessionRetries += 1;
      extractorContext.counter.set('missing-data-retry', 1);
      await extractorContext.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await extractorContext.clearAllCookies();
      await extractorContext.playActionNow({
        constructor: 'ViewportAction',
        width: 1920,
        height: 1080 - 23,
      });
      userAgentString = JSON.parse(allUserAgentString[Math.floor(allUserAgentString.length * Math.random())].config).userAgent + ' ' + Math.random().toString(36).substring(2, 15);
      await extractorContext.goto('about:blank');
      console.log('starting in session retry');
      await run(userAgentString);
      await setZip(zipcode);
    } else {
      await hourlyRetryIncrement();
      throw err;
    }
  }
}

module.exports = {
  implementation: goto,
};
