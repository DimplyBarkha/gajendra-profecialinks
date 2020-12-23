const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'idealo',
    transform,
    domain: 'idealo.de',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      await context.waitForXPath('(//img[contains(@class,"oopStage-galleryCollageImage")]/@src)[1] | (//img[contains(@class,"rsMainSlideImage")]/@src)[1]');
    } catch (error) {
      console.log('Main Image load failed');
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        const shippingInfo = JSON.parse(document.evaluate('//div[contains(@class,"leadoutbox-price")]/a[@data-gtm-payload]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.getAttribute('data-gtm-payload'));
        shippingInfo && shippingInfo.shop_name && addElementToDocument('pd_shipping_info', shippingInfo.shop_name);
      } catch (error) {
        console.log('Failed to fetch shipping info');
      }
      try {
        // @ts-ignore
        const dataObj = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText.trim());
        if (dataObj) {
          dataObj && dataObj.aggregateRating && dataObj.aggregateRating.ratingValue && addElementToDocument('agg_rating', dataObj.aggregateRating.ratingValue.toFixed(2).replace('.', ','));
          dataObj && dataObj.aggregateRating && dataObj.aggregateRating.ratingCount && addElementToDocument('rating_count', dataObj.aggregateRating.ratingCount);
          dataObj && dataObj.manufacturer && dataObj.manufacturer.name && addElementToDocument('pd_manufacturer', dataObj.manufacturer.name);
          dataObj && dataObj.offers && dataObj.offers && dataObj.offers.lowPrice && addElementToDocument('pd_price', dataObj.offers.lowPrice.toString().replace('.', ','));
        }
      } catch (error) {
        console.log('json one not present');
      }
      try {
        const dataObjTwo = JSON.parse(document.querySelector('meta[name="ipc-init"]').getAttribute('data-ipc-init').trim());
        if (dataObjTwo) {
          dataObjTwo && dataObjTwo.productId && addElementToDocument('pd_variant_id', dataObjTwo.productId);
        }
      } catch (error) {
        console.log('json two not present');
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
