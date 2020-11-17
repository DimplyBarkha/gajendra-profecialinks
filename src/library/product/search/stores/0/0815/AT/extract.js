const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: '0815',
    transform,
    domain: '0815.at',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(() => {
      var searchUrl = window.location.href;
      var appendElements = document.querySelectorAll('.product-image-inner');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }
    });
    try {
      await context.waitForSelector('div[class="product-image-inner"]  img', { timeout: 40000 });
      console.log('selector loaded');
    } catch (e) {
      console.log('not able to load the selector');
    }
    const res = await context.evaluate(() => {
      return Boolean(document.querySelector('.custom-product-overlay'));
    });
    if (!res) {
      console.log('No products found for this search term');
    }
    return await context.extract(productDetails, { transform });
  },
};
