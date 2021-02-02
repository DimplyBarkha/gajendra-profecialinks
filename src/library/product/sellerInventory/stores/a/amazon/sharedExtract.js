const getStockFunc = async function ({ context, sellerId, id, url }) {

  let captchas = 0
  let MAX_CAPTCHAS = 3

  const pageContext = async () => {
    return await context.evaluate(() => {
      console.log('context.evaluate');
      const selectors = {
        isCaptchaPage: 'img[src*="/captcha/"]',
        is400Page: 'a[href*="404_logo"]',
        is500Page: 'img[src*="500-title"], a[href*="503_logo"], a img[src*="503.png"], a[href*="ref=cs_503_link"]',
        hasProdDetails: '#prodDetails, #detailBullets_feature_div',
        hasSalesRank: '#detailBullets_feature_div a[href*="bestsellers"], #detailBullets a[href*="bestsellers"], #prodDetails a[href*="bestsellers"], #SalesRank',
        hasSalesRankBadge: '#ppd i[class*="best-seller-badge"]',
        hasAplus: '#aplus',
        hasProductDescription: '#productDescription',
        hasShippingDetails: '#contextualIngressPtLabel_deliveryShortLine',
        hasCookieAcceptRequest: '#sp-cc-accept',
        hasDogsofAmazon: 'img[alt*="Dogs of Amazon"]',
        hasTitle: 'title, #gouda-common-atf h1',
        hasToCartBtn: '#hlb-view-cart-announce',
        hasProdsToDeleteInCart: 'div[data-asin] div[class*=removed]:not([style=""]) + div input[value*="Delete"], .sc-list-item-content input[data-action=delete]',
        hasAddOnModal: '#attach-popover-lgtbox:not([style*="display: none"])',
        hasAddOnModalBtn: '#attachSiNoCoverage-announce',
        hasAddOnModalBtnAlt: '#attach-popover-lgtbox:not([style*="display: none"])',
        hasAddOnPopUp: '#siNoCoverage-announce',
        hasToCartFromModal: 'input[type=submit][aria-labelledby*="cart"]',
        hasItemsInCart: '#nav-cart-count:not([class*="cart-0"])',
        hasdropDownQuantity: '[import=element] span[data-action*=dropdown]',
        hasBuyNewBtn: '#buyNew_cbb',
        hasNoThanksAddOn: '#buybox-see-all-buying-choices-announce',
        sellerName: 'div[id*="used"] #tabular-buybox>table>tbody>tr:nth-child(1)>td:nth-child(2) span.a-truncate-full a, div[id*="used"] #merchant-info>a[id*="seller"]:nth-child(1), div[id*="used"] #merchant-info>a[id*="seller"], #qualifiedBuybox #tabular-buybox>table>tbody>tr:nth-child(2)>td:nth-child(2) span.a-truncate-full a, div[id*="new"] #tabular-buybox>table>tbody>tr:nth-child(2)>td:nth-child(2) span.a-truncate-full a,#qualifiedBuybox #merchant-info a, div[id*="new"] #merchant-info a'
      };

      const elementChecks = {};

      for (var prop in selectors) {
        if (document.querySelector(selectors[prop])) {
          elementChecks[prop] = true;
        } else { elementChecks[prop] = false; }
      }
      
      elementChecks.hasShoppingCart = window.ue_pty ? window.ue_pty.includes("ShoppingCart") : false
      elementChecks.isCartPage = window.ue_pty ? window.ue_pty.includes("ShoppingCart") && !elementChecks.hasToCartBtn : false
      elementChecks.isCartTransitionPage = window.ue_pty ? window.ue_pty.includes("ShoppingCart") && elementChecks.hasToCartBtn : false
      elementChecks.isBestSellerPage = window.ue_pty ? window.ue_pty.includes("zeitgeist") : false
      elementChecks.isSearchPage = window.ue_pty ? window.ue_pty.includes("Search") : false
      elementChecks.isReviewsPage = window.ue_pty ? window.ue_pty.includes("CustomerReviews") : false
      elementChecks.isProductPage = window.ue_pty ? window.ue_pty.includes("Detail") : false
      elementChecks.isOffersPage = window.ue_pty ? window.ue_pty.includes("OfferListing") : false
      elementChecks.hasVariants = !!window.isTwisterPage
      elementChecks.windowLocation =  window.location ? window.location : {}
      elementChecks.sellerName = elementChecks.sellerName ? document.evaluate('(//*[contains(@id, "buyNew_cbb")]//*[contains(@id, "sfsb_accordion_head")]/div[1]/div//span[2] | //div[@id="used"]//*[contains(@id,"tabular-buybox")]/table/tbody/tr[1]/td[2]//span[contains(@class, "a-truncate-full")]//a | //div[contains(@id,"used")]//*[contains(@id,"merchant-info")]/a[contains(@id,"seller")][1] | //div[contains(@id,"used")]//*[contains(@id, "merchant-info")]/a[contains(@id,"seller")] | //*[contains(@id, "qualifiedBuybox")]//*[contains(@id, "tabular-buybox")]/table/tbody/tr[2]/td[2]//span[contains(@class, "a-truncate-full")]//a | //div[contains(@id,"new")]//*[contains(@id, "tabular-buybox")]/table/tbody/tr[2]/td[2]//span[contains(@class, "a-truncate-full")]//a | //*[contains(@id,"qualifiedBuybox")]//*[contains(@id, "merchant-info")]//a | //div[contains(@id,"new")]//*[contains(@id,"merchant-info")]//a)[1]', document, null, XPathResult.ANY_TYPE, null).iterateNext().innerText : false;
      if(!!document.body){
        document.body.setAttribute('current_page_url', window.location.href);
      }
      return elementChecks;
    });
  };

  const pageContextCheck = async (page) => {
    console.log('pageContextCheck', page);
    if (Object.entries(page).filter(item => item[0] != 'windowLocation').filter(item => item[1] === true).length === 0) {
      context.counter.set('dropped_data', 1);
      await context.reload();
      await new Promise(r => setTimeout(r, 2000));
      console.log('Waiting for page to reload');
      await context.waitForNavigation({ timeout: 30 });
      return await solveCaptchaIfNecessary(await pageContext());
    }
    return page;
  };

  const acceptCookies = async () => {
    console.log('page.hasCookieAcceptRequest: ', 'true');
    await context.click('#sp-cc-accept');
    console.log('Waiting for cookie modal to close');
  };

  const acceptCookiesIfNecessary = async (page) => {
    if (page.hasCookieAcceptRequest) {
      console.log('Checking for cookie accept request');
      await acceptCookies();
      console.log('Done checking for cookie accept request');
      page = await pageContext();
      console.log('page:', page);
    }
    return page;
  };

  const solveCaptcha = async () => {
    console.log('isCaptcha');

    await context.solveCaptcha({
      type: 'IMAGECAPTCHA',
      inputElement: 'form input[type=text][name]',
      imageElement: 'form img',
      autoSubmit: true,
    });

    console.log('solved captcha, waiting for page change');
    await context.waitForNavigation(30);

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

  const handlePage = async (page, lastResponseData) => {
    let lastResponseCode = lastResponseData ? lastResponseData.status : 200;

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
      context.reportBlocked(lastResponseCode, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
    }

    if (lastResponseCode === 503 || page.is500Page) {
      console.log('getting  503 pageId');

      console.log('Clicking 503 image');
      await context.click('a img[src*="503.png"], a[href*="ref=cs_503_link"], a img[src*="error/500-title"]');

      console.log('Waiting for page to reload on homepage using 503  pageId');
      await context.waitForNavigation(30);

      page = await pageContext();
      if (page.is500Page) {
        // we failed to solve the CAPTCHA or a second captcha was thrown
        context.reportBlocked(lastResponseCode, 'Blocked: Could not work around 503');
      }

      page = await solveCaptchaIfNecessary(page);
      if (page.isCaptchaPage) {
        // we failed to solve the CAPTCHA or a second captcha was thrown
        context.reportBlocked(lastResponseCode, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
      }

      console.log('Go to some random page');
      const clickedOK = await context.evaluate(function () {
        const links = Array.from(document.querySelectorAll('a[href*="/dp/"]'));
        if (links.length === 0) {
          return false;
        }
        links[Math.floor(links.length * Math.random())].click();
        return true;
      });
      page = await solveCaptchaIfNecessary(page);

      if (!clickedOK) {
        console.log('Could not click a product, aborting... :/');
        // return await pageContext();
      }

      await new Promise(r => setTimeout(r, 2000));

      console.log('Going back to desired page');
      lastResponseData = await context.goto(url, {
        checkBlocked: true,
      });
      lastResponseCode = lastResponseData.status;
      console.log('lastResponseData: ', lastResponseCode);
      page = await pageContext();
      console.log('page: ', page);
    }

    if (lastResponseCode === 404 || lastResponseCode === 410 || page.is400Page || (page.hasDogsofAmazon && !page.is500Page)) {
      return false;
    }

    if (lastResponseCode !== 200 && (page.is400Page || page.is500Page)) {
      return context.reportBlocked(lastResponseCode, 'Blocked: ' + lastResponseCode);
    }

    await context.checkBlocked();

    page = await acceptCookiesIfNecessary(page);

    if (lastResponseData && (lastResponseData.url.includes('elasticbeanstalk') || lastResponseData.url.includes('www.primevideo.com'))) {
      context.counter.set('primevideo', 1);
    }

    return page;
  };

  // find product&seller in cart
  const productSellerFound = async (sellerId, id) => {
    return await context.evaluate(async (a, b) => {
      const productXpath = `//div[@data-asin="${b}" and //*[contains(@href, "${a}")]]/*[1]`;
      const el = document.evaluate(productXpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
      if (el) {
        console.log('found product')
        el.parentElement.setAttribute('import', 'element');
        return !!document.querySelector('div[data-asin][import]:not([data-removed])')
      }
    }, sellerId, id);
  };

  const artifactCartItems = async () => {
    return await context.evaluate(async () => {
      if(!!document.querySelector('div[data-asin]:not([import]):not([data-removed]) input[value*="Delete"]')){
        console.log('found artifact prod in cart')
        return true
      }
    })
  }

  /* ----------ACTION----------- */
  let page = await pageContext(); 
  const sellerName = page.sellerName;
  console.log('sellerNameTest', sellerName)

  if (page.hasBuyNewBtn) { 
    await context.click('#buyNew_cbb');
    await new Promise(resolve => setTimeout(resolve, 1000));
  } 
  if (page.hasNoThanksAddOn) {
    await context.click('#beuybox-see-all-buying-choices-announce');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await context.click('#add-to-cart-button:not([style*="not-allowed"])')
  await context.waitForNavigation();
  await new Promise(resolve => setTimeout(resolve, 3000));

  page = await pageContext();
  await handlePage(page, null);

  // decline add ons from pop out modal with cart button or addons
  if (page.hasAddOnModal) {
      if(page.hasAddOnModalBtn){
        await context.click('#attachSiNoCoverage-announce');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }else if(page.hasAddOnModalBtnAlt){
        await context.click('#attach-popover-lgtbox:not([style*="display: none"])');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    await new Promise(resolve => setTimeout(resolve, 3000));
    page = await pageContext();
    await handlePage(page, null);
  }
  if (page.hasAddOnPopUp) {
    await context.click('#siNoCoverage-announce');
    await new Promise(resolve => setTimeout(resolve, 5000));
    page = await pageContext();
    await handlePage(page, null);
  }


  let pageCheck = 0;
  while (!page.isCartPage && pageCheck < 5) {
    if (page.hasToCartFromModal) {
      await context.click('#nav-cart');
      // await context.click('#attach-view-cart-button-form input[type=submit][aria-labelledby*="cart"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else if (page.isCartTransitionPage) {
      await context.click('#hlb-view-cart-announce');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else if (!page.hasToCartFromModal && !page.hasAdOnModal && page.hasItemsInCart) {
      await context.click('#nav-cart');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    pageCheck++;
    await context.waitForNavigation();
    await new Promise(resolve => setTimeout(resolve, 3000));
    page = await pageContext();
    await handlePage(page, null);
  }

  if (page.isCartPage) {
    await context.waitForSelector('span.quantity span span,input.sc-quantity-textfield');
    if (await productSellerFound(sellerId, id)) {
      while (await artifactCartItems()) {
        console.log('deleting prods')
        await context.waitForSelector('div[data-asin][import]:not([data-removed])');
        await context.click('div[data-asin]:not([import]):not([data-removed]) input[value*="Delete"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        await productSellerFound(sellerId, id);
        console.log('artifact deleted');
      }
      await productSellerFound(sellerId, id)
      page = await pageContext();
      if (page.hasdropDownQuantity) {
        await context.click('[import=element] span[data-action*=dropdown]');
        await context.waitForSelector('li.quantity-option:last-child a');
        await context.click('li.quantity-option:last-child a');
      }
      await context.setInputValue('[import=element] input.sc-quantity-textfield', '999');
      await context.click('[import=element] span.sc-update-link a');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if(!await productSellerFound(sellerId, id)){
        console.log('no product found')
        return
      };
      await context.waitForSelector('div[data-asin][import]:not([data-removed])')
    }
    if(sellerName){
      console.log('appending seller name')
      await context.evaluate((sellerName) => {
        let ele = document.querySelector('div[import=element]');
        if(ele){
          ele.setAttribute('seller', sellerName);
        }
      }, sellerName)
    }
  }
};
module.exports = { getStockFunc };
