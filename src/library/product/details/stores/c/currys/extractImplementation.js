const implementation = async (
  { id },
  parameters,
  context,
  dependencies,
) => {
  const optionalWaitForSelector = async (selector, timeout = 35000) => {
    try {
      await context.waitForSelector(selector, { timeout });
      console.log(`${selector} loaded.`);
      return true;
    } catch (err) {
      console.log(`${selector} never loaded.`);
      return false;
    }
  };

  await optionalWaitForSelector('.shopList .product');

  const readMore = await optionalWaitForSelector('div[data-open-label="Read more"] ~ .long-text-ctl a');

  if (readMore) {
    await context.click('div[data-open-label="Read more"] ~ .long-text-ctl a');
    const readMore = await context.evaluate(() => {
      return document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a') && document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a').innerText === 'Read more';
    });
    if (readMore) {
      await context.evaluate(() => {
        document.querySelector('div[data-open-label="Read more"] ~ .long-text-ctl a').click();
      });
    }
  }

  const checkExistance = async (selector) => {
    return await context.evaluate(async (currentSelector) => {
      return await Boolean(document.querySelector(currentSelector));
    }, selector);
  };
  const delay = t => new Promise(resolve => setTimeout(resolve, t));

  // check for cookie button - 
  const cookieBtnSel = 'button[id*="onetrust-accept-btn-handler"]';
  try {
    await context.waitForSelector(cookieBtnSel);
  } catch(err) {
    console.log('error while waiting for cookie btn', err.message);
  }
  let cookieBtnPresent = await checkExistance(cookieBtnSel);
  if(cookieBtnPresent) {
    console.log('cookie btn is present');
    try {
      await context.click(cookieBtnSel);
    } catch(err) {
      console.log('error while clicking the cookies btn', err.message);
    }
  } else {
    console.log('cookie btn is not present');
  }

  const currentUrl = await context.evaluate(() => {
    if (document.querySelector('meta[property="og:url"]')) { return document.querySelector('meta[property="og:url"]').getAttribute('content'); }
  });
  const iframeSelector = '#eky-dyson-iframe';
  if (await checkExistance(iframeSelector)) {
    const iframeUrl = await context.evaluate((iframeSelector) => {
      if (document.querySelector(iframeSelector)) { return document.querySelector(iframeSelector).getAttribute('src'); }
    }, iframeSelector);
    await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
    await context.waitForXPath('//video');
    await delay(20000);
    const video = await context.evaluate(() => {
      const src = ele('video');
      function ele (tag) {
        return document.querySelectorAll(tag);
      }
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].currentSrc);
        }
      }
      return value;
    });

    await context.evaluate(() => {
      const scrollTo = document.querySelector('#specifications');
      scrollTo.scrollIntoView({ behavior: 'smooth' });
    });
    await context.waitForSelector('div[class="eky-row left-padding divider-line"] img');
    await delay(20000);
    const images = await context.evaluate(() => {
      const src = document.querySelectorAll('div[class="eky-row left-padding divider-line"] img');
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].currentSrc);
        }
      }
      return value;
    });

    const desc = await context.evaluate(() => {
      const src = document.querySelectorAll('h1,h2,h3,h4,p,div.eky-accessory>div');
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].innerText);
        }
      }
      return value;
    });
    await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate((video) => {
      video = video.join(' | ');
      document.querySelector('body').setAttribute('video-src', video);
    }, video);
    await context.evaluate((images) => {
      images = images.join(' | ');
      console.log(images);
      const len = images.length;
      if (images[len - 2] === '|') {
        console.log('removing | ');
        images = images.slice(0, len - 3);
      }
      console.log(images);
      document.querySelector('body').setAttribute('img-src', images);
    }, images);
    await context.evaluate((desc) => {
      desc = desc.join(' | ');
      document.querySelector('body').setAttribute('desc', desc);
    }, desc);
  }
  await delay(10000);

  await context.evaluate(async function (zip, country) {
    // eslint-disable-next-line
    const basicDetails = JSON.parse(document.evaluate(`//script[contains(.,'"@type": "Product"')]`, document).iterateNext().textContent);
    const productDigitalData = JSON.parse(document.querySelector('script[id="app.digitalData"]').textContent).product[0];

    const addElement = (id, content) => {
      const packagingElem = document.createElement('div');

      packagingElem.id = id;
      packagingElem.innerText = content;

      document.body.appendChild(packagingElem);
    };

    const makeApiCall = async (url, options) => {
      try {
        console.log(`Making API call to => ${url}`);
        if (!options) {
          options = {
            mode: 'no-cors',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
          };

          return await (await fetch(url, options)).json();
        }

        return await (await fetch(url, options)).text();
      } catch (err) {
        console.log('Error while making API call.', err);
      }
    };

    const buildDescription = () => {
      const article = document.querySelector('#product-info article');
      const description = document.querySelector('.highlights-tablet .main-desc .section-title ~ ul');
      const subNodes = description.querySelectorAll('li');

      let text = '';
      subNodes.forEach(subNode => {
        text += `||${subNode.textContent}`;
      });

      text += article ? ` ${article.textContent.trim()}` : '';
      return text.trim();
    };

    const getSpecification = () => {
      const tbodys = document.querySelectorAll('div#tab2 tbody');
      let content = '';
      tbodys.forEach(tb => {
        const trs = tb.querySelectorAll('tr');
        trs.forEach(t => {
          if (content) {
            content += ' || ';
          }
          content += t.querySelector('th').textContent + ' : ' + t.querySelector('td').textContent;
        });
      });

      return content;
    };
    addElement('specification', getSpecification());

    const isSelectorPresent = (sel) => {
      return Boolean(document.querySelector(sel));
    };

    const zipInput = isSelectorPresent('div[data-anonid="locationinput"] input[type="search"]');
    const delivery = isSelectorPresent('#delivery.available');
    const outOfStock = isSelectorPresent('.prd-channels .nostock');
    let availability = 'In Stock';

    if (zipInput) {
      let countryRoute = 'https://www.currys.co.uk/gb/uk';
      let long = '-0.106932';
      let lat = '51.508413';

      if (country === 'IE') {
        countryRoute = 'https://www.currys.ie/ie/en';
        long = '-6.26495';
        lat = '53.33537';
      }

      const uri = `${countryRoute}/mcd_postcode_check/sProductId/${basicDetails.sku}/sPostCode/${zip}/latitude/${lat}/longitude/${long}/ajax.html`;
      const res = await makeApiCall(uri);
      console.log(res);
      if (res.status === 'success' && res.data && res.data.postCodeCheck && res.data.postCodeCheck.state !== 'DELIVERABLE') {
        availability = 'Out Of Stock';
      }
    } else if (outOfStock) {
      availability = 'Out Of Stock';
    } else if (!delivery) {
      availability = 'Out Of Stock';
    }
    addElement('availability', availability);

    const actualRating = basicDetails && basicDetails.aggregateRating && basicDetails.aggregateRating.ratingValue && Number(basicDetails.aggregateRating.ratingValue);
    const updatedRating = actualRating ? (actualRating * 5) / 10 : '';
    addElement('rating', updatedRating);

    const productId = productDigitalData.productID || '';
    addElement('productId', productId);

    const manufacturer = productDigitalData.manufacturer || '';
    addElement('manufacturer', manufacturer);

    const brand = (basicDetails.brand && basicDetails.brand.name) || '';
    addElement('brand', brand);

    const description = buildDescription();
    addElement('description', description);
  }, parameters.zipcode, parameters.country);

  try {
    await context.waitForSelector(cookieBtnSel);
  } catch(err) {
    console.log('error while waiting for cookie btn', err.message);
  }
  cookieBtnPresent = await checkExistance(cookieBtnSel);
  if(cookieBtnPresent) {
    console.log('cookie btn is present');
    try {
      await context.click(cookieBtnSel);
    } catch(err) {
      console.log('error while clicking the cookies btn', err.message);
    }
  } else {
    console.log('cookie btn is not present');
  }
  // need to get the videos
  let manufacturerContentVideoSel = 'iframe[title*="Flix-media-video"]';
  try {
    await context.waitForSelector(manufacturerContentVideoSel);
    console.log('we have the video iframe');
  } catch(err) {
    console.log('got some error while waiting for video in manufac-content', err.message);
    try {
      await context.waitForSelector(manufacturerContentVideoSel);
      console.log('we have the video iframe');
    } catch(err) {
      console.log('got some error while waiting for video in manufac-content -- again', err.message);
    }
  }

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      async function stall ( ms ) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('waiting!!');
            resolve();
          }, ms);
        });
      }
      let scrollTop = 0;
      while (scrollTop !== 15000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        console.log('scrolling now!!');
        if (scrollTop === 15000) {
          await stall(3000);
          break;
        }
      }
    });
  };
  
  await applyScroll(context);

  await context.evaluate(async (manufacturerContentVideoSel) => {
    let videoUrlArr = [];
    let allVideoElms = document.querySelectorAll(manufacturerContentVideoSel);
    if((!allVideoElms) || (allVideoElms.length === 0)) {
      return;
    }

    for(let i = 0; i < allVideoElms.length; i++) {
      let thisUrl = '';
      if(allVideoElms[i].hasAttribute('src')) {
        thisUrl = allVideoElms[i].getAttribute('src');
      } else if(allVideoElms[i].hasAttribute('_src')) {
        thisUrl = allVideoElms[i].getAttribute('_src');
      } else {
        console.log('we do not have src or _src for ' + i + 'th iframe');
      }
      console.log(thisUrl);
      videoUrlArr.push(thisUrl);
    }

    let videoSet = new Set(videoUrlArr);
    console.log('we got ' + videoSet.size + ' unique elements');
    videoUrlArr = Array.from(videoSet);

    async function addElementToDocumentAsync (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      document.body.appendChild(catElement);
    }

    await addElementToDocumentAsync('manufacvideos', videoUrlArr.join(' || '));
    return;
  },
  manufacturerContentVideoSel);

  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
};

module.exports = { implementation };
