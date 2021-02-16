const { transform } = require('../../../../sharedAmazon/transformNew');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { goto, productDetails, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  async function loadContent () {
    try {
      await context.evaluate(() => {
        document.querySelector('#reviewsMedley').scrollIntoView({
          behavior: 'smooth',
        });
      });
      await context.waitForNavigation({ waitUntil: 'networkidle0' });
      await context.waitForSelector('[data-feature-name="productDetails"],[data-feature-name="detailBullets"]', { timeout: 10000 });
      return true;
    } catch (err) {
      return false;
    }
  }

  const MAX_TRIES = 3;
  let counter = 1;
  let loaded = false;
  do {
    loaded = await loadContent();
    if (!loaded) {
      console.log('Details not loaded, appending data.');
      async function appendData () {
        try {
          const asin = document.evaluate('//*[contains(@id, "imageBlock_feature_div")]//script[contains(text(), "winningAsin")]', document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().innerText.match(/winningAsin': '([^']+)/s)[1] ? document.evaluate('//*[contains(@id, "imageBlock_feature_div")]//script[contains(text(), "winningAsin")]', document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().innerText.match(/winningAsin': '([^']+)/s)[1] : (document.querySelector('#all-offers-display-params') ? document.querySelector('#all-offers-display-params').getAttribute('data-asin') : '');
          const pgid = document.querySelector('html').innerHTML.match(/productGroupID=([\w]+)|productGroupID":"([^"]+)/)[1] || document.querySelector('html').innerHTML.match(/productGroupID=([\w]+)|productGroupID":"([^"]+)/)[2] || '';
          const params = {
            asinList: asin,
            id: asin,
            parentAsin: window.isTwisterPage ? window.twisterController.twisterJSInitData.parent_asin : asin,
            pgid,
            psc: 1,
            triggerEvent: 'twister',
            isUDPFlag: 1,
            json: 1,
            ptd: document.querySelector('html').innerHTML.match(/productTypeName=([\w]+)|productTypeName":"([^"]+)/) && (document.querySelector('html').innerHTML.match(/productTypeName=([\w]+)|productTypeName":"([^"]+)/)[1] || document.querySelector('html').innerHTML.match(/productTypeName=([\w]+)|productTypeName":"([^"]+)/)[2]) || pgid.match(/^[^_]+/)[0],
            dpEnvironment: 'hardlines',
          };
          const query = Object.entries(params).map(elm => `${elm[0]}=${elm[1]}`);

          const parseResponse = (blob) => {
            const dataBlobs = blob.split('&&&').map(part => part.replace(/\n/g, '').trim()).filter(part => part.length > 0).map(part => JSON.parse(part));
            return dataBlobs;
          };
          const api = '/gp/page/refresh?sCac=1&twisterView=glance&auiAjax=1&json=1&dpxAjaxFlag=1&ee=2&enPre=1&dcm=1&ppw=&ppl=&isFlushing=2&dpEnvironment=hardlines&mType=full&psc=1&' + query.join('&');
          const dataRaw = await fetch(api)
            .then(response => response.text())
            .then(blob => parseResponse(blob));

          console.log('# elements attempting to append: ', dataRaw.length);
          let appendedCount = 0;
          dataRaw.forEach(part => {
            const element = document.getElementById(Object.keys(part.Value.content)[0]);
            if (element || Object.keys(part.Value.content)[0].match(/^dpx-.+_feature_div$/)) {
              // element.innerHTML = Object.values(part.Value.content)[0];
            } else {
              const div = document.createElement('div');
              div.setAttribute('id', Object.keys(part.Value.content)[0]);
              div.innerHTML = Object.values(part.Value.content)[0];
              const appendAtBottom = document.getElementById('a-page');
              if (appendAtBottom) {
                appendAtBottom.insertBefore(div, document.getElementById('navFooter'));
                appendedCount++;
              } else {
                console.log('couldnt find a good place to append data');
              }
            }
          });

          console.log('Total divs appended: ', appendedCount);
          return true;
        } catch (err) {
          console.log('append data try  catch fail', err);
          return false;
        }
      }
      await context.evaluate(appendData);
    }
    counter++;
  } while (!loaded && counter <= MAX_TRIES);
  if (!loaded) {
    console.log('Product detail not loaded.');
  }
  async function getOtherSellerInfo (id) {
    const asin = id || document.querySelector('#added-asin').innerText.match(/\w+/)[0];
    let page = 1;
    let api = `/gp/aod/ajax?asin=${asin}&pageno=${page}`;
    let notLastPage = true;
    let data = [];
    let totalCount = 0;
    while (notLastPage) {
      const response = await fetch(api);
      if (response.status !== 200) {
        data = Array.from(document.querySelectorAll('#mbc > div.mbc-offer-row')).map(offer => {
          const sellerPrice = offer.querySelector('span[id^="mbc-price"]') && offer.querySelector('span[id^="mbc-price"]').innerText || '';
          const sellerName = offer.querySelector('span.mbcMerchantName') && offer.querySelector('span.mbcMerchantName').innerText || '';
          const shippingPrice = offer.querySelector('span[id^="mbc-shipping-fixed"]') && offer.querySelector('span[id^="mbc-shipping-fixed"]').textContent || '0.00';
          const sellerId = offer.querySelector('span[data-a-popover]') && offer.querySelector('span[data-a-popover]').getAttribute('data-a-popover');
          const sellerPrime = offer.querySelector('[target="AmazonHelp"]') && 'YES' || 'NO';
          return { sellerPrice, sellerName, shippingPrice, sellerPrime, sellerId };
        });
        break;
      }
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (page === 1) {
        totalCount = doc.querySelector('#aod-total-offer-count').value;
        const primeFlag = doc.querySelector('div[id^="aod-bottlingDepositFee-0"]+span>a') && 'Yes - Shipped and Sold';
        if (primeFlag) {
          document.body.setAttribute('prime-flag', primeFlag);
        }
        let shippingPrice = doc.querySelector('div[id^="aod-bottlingDepositFee-0"]+span>span') && doc.querySelector('div[id^="aod-bottlingDepositFee-0"]+span>span').textContent;
        if (shippingPrice) {
          shippingPrice = shippingPrice.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/) && shippingPrice.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)[0];
          document.body.setAttribute('shipping-price-main', shippingPrice);
        }
        const seller = doc.querySelector('#aod-pinned-offer #aod-offer-soldBy a');
        if (seller) {
          const sellerId = seller.href.match(/seller=(\w+)/);
          if (sellerId) {
            document.body.setAttribute('seller-id-main', sellerId[1]);
          }
        }
      }
      const sellerData = Array.from(doc.querySelectorAll('#aod-offer')).map(offer => {
        const sellerPrice = offer.querySelector('div[id^="aod-price"] span[class="a-offscreen"]') && offer.querySelector('div[id^="aod-price"] span[class="a-offscreen"]').innerText || '';
        const sellerName = offer.querySelector('div[id="aod-offer-soldBy"] a, div[id="aod-offer-soldBy"] div[class="a-fixed-left-grid-col a-col-right"] > span[class="a-size-small a-color-base"]') && offer.querySelector('div[id="aod-offer-soldBy"] a,div[id="aod-offer-soldBy"] div[class="a-fixed-left-grid-col a-col-right"] > span[class="a-size-small a-color-base"]').innerText || '';
        const shippingPrice = offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>span') && offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>span').textContent || '0.00';
        const sellerId = offer.querySelector('#aod-offer-soldBy a') && offer.querySelector('#aod-offer-soldBy a').href;
        const sellerPrime = offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>a') && 'YES' || 'NO';
        return { sellerPrice, sellerName, shippingPrice, sellerPrime, sellerId };
      });
      data = data.concat(sellerData);
      notLastPage = Number(totalCount) > data.length;
      api = `/gp/aod/ajax?asin=${asin}&pageno=${++page}`;
    }
    if (data.length === 0) {
      data = Array.from(document.querySelectorAll('#mbc > div.mbc-offer-row')).map(offer => {
        const sellerPrice = offer.querySelector('span[id^="mbc-price"]') && offer.querySelector('span[id^="mbc-price"]').innerText || '';
        const sellerName = offer.querySelector('span.mbcMerchantName') && offer.querySelector('span.mbcMerchantName').innerText || '';
        const shippingPrice = offer.querySelector('span[id^="mbc-shipping-fixed"]') && offer.querySelector('span[id^="mbc-shipping-fixed"]').textContent || '0.00';
        const sellerId = offer.querySelector('span[data-a-popover]') && offer.querySelector('span[data-a-popover]').getAttribute('data-a-popover');
        const sellerPrime = offer.querySelector('[target="AmazonHelp"]') && 'YES' || 'NO';
        return { sellerPrice, sellerName, shippingPrice, sellerPrime, sellerId };
      });
    }
    const lbb = data.find(elm => elm.sellerName.includes('Amazon')) ? 'YES' : 'NO';
    document.body.setAttribute('is-llb', lbb);
    const currentSellerId = document.querySelector('[name="merchantID"]') && document.querySelector('[name="merchantID"]').value;
    if (currentSellerId) {
      data = data.filter(seller => !(seller.sellerId && seller.sellerId.includes(currentSellerId)));
    }
    const sellerPrice = data.map(seller => seller.sellerPrice.trim()).join('|');
    const sellerName = data.map(seller => seller.sellerName.trim()).join('|');
    const shippingPrice = data.map(seller => {
      const price = seller.shippingPrice.replace('+', '').trim();
      return price.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/) ? price.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)[0] : '0.00';
    }).join('|');
    const sellerPrime = data.map(seller => seller.sellerPrime.trim()).join('|');
    const sellerId = data.map(seller => {
      if (seller.sellerId && seller.sellerId.match(/seller=(\w+)/)) {
        return seller.sellerId.match(/(seller|&me)=(\w+)/)[2];
      }
    }).join('|');
    document.body.setAttribute('seller-price', sellerPrice);
    document.body.setAttribute('seller-name', sellerName);
    document.body.setAttribute('shipping-price', shippingPrice);
    document.body.setAttribute('seller-prime', sellerPrime);
    document.body.setAttribute('seller-id', sellerId);
    console.log(data);
    return data;
  }
  await helpers.addURLtoDocument('added-url');
  const asin = await context.evaluate(() => {
    return window.location.href.match(/\/dp\/(product\/)?(\w+)/)[2];
  });
  await helpers.addItemToDocument('added-asin', asin);
  let variants = await amazonHelp.getVariants();

  if (variants && variants.length) {
    const asin = context.evaluate(() => document.querySelector('#added-asin').innerText);
    // helpers.addItemToDocument('my-variants', variants.join(' | '));
    variants = variants.filter(v => !v.trim().includes(asin));
    helpers.addItemToDocument('my-variants', variants);
  }
  async function getCustomerViewed () {
    if (!document.querySelector('#desktop-dp-sims_session-similarities-sims-feature > div[data-p13n-asin-metadata]')) return;
    let asins = Object.keys(JSON.parse(document.querySelector('#desktop-dp-sims_session-similarities-sims-feature > div[data-p13n-asin-metadata]').getAttribute('data-p13n-asin-metadata')));
    asins = Array.from(new Set(asins));
    const API = `/gp/p13n-shared/faceout-partial?widgetTemplateClass=PI::Similarities::ViewTemplates::Carousel::Desktop&productDetailsTemplateClass=PI::P13N::ViewTemplates::ProductDetails::Desktop::DeliverySpeed&reftagPrefix=pd_sbs_325&faceoutTemplateClass=PI::P13N::ViewTemplates::Product::Desktop::CarouselFaceout&count=7&offset=42&asins=${asins.join(',')}`;
    const res = await fetch(API);
    const json = await res.json();
    const htmlData = json.map(elm => unescape(elm));
    const container = document.createElement('div');
    container.setAttribute('class', 'customer-also-viewed grid-container');
    for (const html of htmlData) {
      const div = document.createElement('div');
      div.setAttribute('class', 'grid-item');
      div.innerHTML = html;
      container.append(div);
    }
    document.body.append(container);
  }
  const zoomXpath = '//span[@id="canvasCaption" and contains(text(),  "Roll over")]';
  await helpers.getAndAddElem(zoomXpath, 'added-imageZoomFeaturePresent', { callback: val => val ? 'Yes' : 'No' });

  const xpath360 = '//li[contains(@class, "pos-360") and not(contains(@class, "aok-hidden"))]//img';
  await helpers.getAndAddElem(xpath360, 'added-image360Present', { property: 'src', callback: val => val ? 'Yes' : 'No' });
  /*
  const colorXpath = '//div[contains(@id,"variation_color_name")]//span[contains(@class, "selection")]';
  await helpers.getAndAddElem(colorXpath, 'added-color'); */
  try {
    await context.evaluate(getOtherSellerInfo);
  } catch (err) {
    console.log('Error while adding other seller info. Error: ', err);
  }
  await context.evaluate(() => {
    const shippingInfo = Array.from(
      document.querySelectorAll(
        'div[id="tabular-buybox"] span[class*="a-truncate-full"]',
      ),
    )
      .map((elm) => elm.innerText.trim())
      .join(' ');
    shippingInfo.length && document.body.setAttribute('shipping-info', shippingInfo);
  });
  await context.evaluate(getCustomerViewed);
  const pasin = await context.evaluate(() => {
    return window.isTwisterPage ? window.twisterController.twisterJSInitData.parent_asin : null;
  });
  await helpers.addItemToDocument('added-pasin', pasin);
  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform,
    domain: 'amazon.com',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    goto: 'action:navigation/goto',
  },
  implementation,
};
