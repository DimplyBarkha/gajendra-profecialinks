const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    transform,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise(resolve => setTimeout(resolve, 2814));
      const element = document.querySelector('div[class="plp-bottom-navigation"] div[class="pagination-nav"] a[class~="icon-chevron-right"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 2197));
      }
      const elementTwo = document.querySelector('ul[class="plp-product-tiles"] li a img');
      if (elementTwo) {
        elementTwo.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 2197));
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
