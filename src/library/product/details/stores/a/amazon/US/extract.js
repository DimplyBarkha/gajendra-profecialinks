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
  const { goto, productDetails, Helpers: { Helpers } } = dependencies;

  const helpers = new Helpers(context);
  async function loadContent () {
    try {
      await context.evaluate(() => {
        document.querySelector('#reviewsMedley').scrollIntoView({
          behavior: 'smooth',
        });
      });
      await context.waitForNavigation({ waitUntil: 'networkidle0' });
      await context.waitForSelector('[data-feature-name="productDetails"],[data-feature-name="detailBullets"]');
      return true;
    } catch (err) {
      return false;
    }
  }

  const MAX_TRIES = 3;
  let counter = 1;
  let loaded = false;
  const pageUrl = await context.evaluate(() => window.location.href);
  do {
    loaded = await loadContent();
    if (!loaded) {
      await goto({ url: pageUrl });
    }
    counter++;
  } while (!loaded && counter <= MAX_TRIES);
  if (!loaded) {
    throw new Error('Product detail not loaded.');
  }
  async function getOtherSellerInfo (id) {
    const asin = id || document.querySelector('#added-asin').innerText.match(/\w+/)[0];
    // Should we consider getting data from first page(max 10).
    let page = 1;
    let api = `/gp/aod/ajax?asin=${asin}&pageno=${page}`;
    let notLastPage = true;
    let data = [];
    let totalCount = 0;
    while (notLastPage) {
      const response = await fetch(api);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (page === 1) {
        totalCount = doc.querySelector('#aod-total-offer-count').value;
        const primeFlag = doc.querySelector('div[id^="aod-bottlingDepositFee-0"]+span>a') && 'Yes - Shipped and Sold';
        if (primeFlag) {
          document.body.setAttribute('prime-flag', primeFlag);
        }
      }
      const sellerData = Array.from(doc.querySelectorAll('#aod-offer')).map(offer => {
        const sellerPrice = offer.querySelector('div[id^="aod-price"] span[class="a-offscreen"]') && offer.querySelector('div[id^="aod-price"] span[class="a-offscreen"]').innerText || '';
        const sellerName = offer.querySelector('div[id="aod-offer-soldBy"] a, div[id="aod-offer-soldBy"] div[class="a-fixed-left-grid-col a-col-right"] > span[class="a-size-small a-color-base"]') && offer.querySelector('div[id="aod-offer-soldBy"] a,div[id="aod-offer-soldBy"] div[class="a-fixed-left-grid-col a-col-right"] > span[class="a-size-small a-color-base"]').innerText || '';
        const shippingPrice = offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>span') && offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>span').textContent || '0.00';
        const sellerPrime = offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>a') && 'YES' || 'NO';
        return { sellerPrice, sellerName, shippingPrice, sellerPrime };
      });
      data = data.concat(sellerData);
      notLastPage = Number(totalCount) > data.length;
      api = `/gp/aod/ajax?asin=${asin}&pageno=${++page}`;
    }
    const lbb = data.find(elm => elm.sellerName.includes('Amazon')) ? 'YES' : 'NO';
    document.body.setAttribute('is-llb', lbb);
    const sellerPrice = data.map(seller => seller.sellerPrice.trim()).join('|');
    const sellerName = data.map(seller => seller.sellerName.trim()).join('|');
    const shippingPrice = data.map(seller => {
      const price = seller.shippingPrice.replace('+', '').trim();
      return price.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/) ? price.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)[0] : '0.00';
    }).join('|');
    const sellerPrime = data.map(seller => seller.sellerPrime.trim()).join('|');
    document.body.setAttribute('seller-price', sellerPrice);
    document.body.setAttribute('seller-name', sellerName);
    document.body.setAttribute('shipping-price', shippingPrice);
    document.body.setAttribute('seller-prime', sellerPrime);
    console.log(data);
    return data;
  }

  async function pageData () {
    return await context.evaluate(async () => {
      const pageContext = {};
      // get variants
      pageContext.variants = window.isTwisterPage ? [...new Set(Object.keys(window.twisterController.initTwisterState.twisterVariationsData.dimensionValuesDisplay))] : null;
      // get parentAsin
      pageContext.parentAsin = window.isTwisterPage ? window.twisterController.twisterJSInitData.parent_asin : null;
      // get currentAsin
      pageContext.currentAsin = window.isTwisterPage ? window.twisterController.twisterJSInitData.current_asin : window.ue_pti;
      // get largeImageCount
      pageContext.largeImageCount = document.evaluate('//script[contains(text(), "ImageBlockATF")]/text()', document.body, null, XPathResult.ANY_TYPE, null).iterateNext() ? document.evaluate('//script[contains(text(), "ImageBlockATF")]/text()', document.body, null, XPathResult.ANY_TYPE, null).iterateNext().toString().split('SL1500').length : 0;
      // check for additionalRatings
      pageContext.additionalRatings = !!document.querySelector('table#histogramTable');

      return pageContext;
    });
  }

  async function appendData (d, c) {
    const append = { d, c };
    return await context.evaluate(async (data) => {
      if (Array.isArray(data.d)) {
        data.d.map(item => {
          const div = document.createElement('div');
          div.setAttribute('id', item);
          div.setAttribute('class', data.c);
          document.body.appendChild(div);
        });
      } else {
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.setAttribute('id', data.d);
        div.setAttribute('class', data.c);
      }
    }, append);
  }

  async function pageManipulation (page) {
    if (page.additionalRatings) {
      await context.evaluate(async (page) => {
        document.querySelector('table#histogramTable').scrollIntoView();
      }, page);
      await context.waitForXPath('//div[@data-hook="cr-summarization-attributes-list"]//span[contains(@class,"a-size-base")]', { timeout: 5000 })
        .catch(() => console.log('no additional ratings'));
    }
  }

  const pageContext = await pageData();

  await appendData(pageContext.variants, 'my-variants');
  await appendData(pageContext.parentAsin, 'my-parent-asin');
  await appendData(pageContext.currentAsin, 'my-current-asin');
  await appendData(pageContext.largeImageCount, 'my-large-image-count');
  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);

  const zoomXpath = '//span[@id="canvasCaption" and contains(text(),  "Roll over")]';
  await helpers.getAndAddElem(zoomXpath, 'added-imageZoomFeaturePresent', { callback: val => val ? 'Yes' : 'No' });

  const xpath360 = '//li[contains(@class, "pos-360") and not(contains(@class, "aok-hidden"))]//img';
  await helpers.getAndAddElem(xpath360, 'added-image360Present', { property: 'src', callback: val => val ? 'Yes' : 'No' });

  try {
    await context.evaluate(getOtherSellerInfo);
  } catch (err) {
    console.log('Error while adding other seller info');
  }

  await pageManipulation(pageContext);
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
    goto: 'action:navigation/goto',
  },
  implementation,
};
