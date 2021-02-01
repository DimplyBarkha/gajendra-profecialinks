const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function (inputs) {
      document.evaluate('//section[@class="detail-showcase--img-teaser-box"]//div[contains(@class, "detail-showcase--additional-img-box")]//div[contains(@class, "_9wsyEg0KQ2WaBRFIcJs04")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue &&
        document.evaluate('//section[@class="detail-showcase--img-teaser-box"]//div[contains(@class, "detail-showcase--additional-img-box")]//div[contains(@class, "_9wsyEg0KQ2WaBRFIcJs04")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function (inputs) {
      document.evaluate('//button[contains(@class, "ytp-large-play-button")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        && document.evaluate('//button[contains(@class, "ytp-large-play-button")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        && document.evaluate('//button[contains(@class, "ytp-large-play-button")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.extract(productDetails, { transform });
  },
};
