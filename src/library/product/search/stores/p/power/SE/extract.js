const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'power',
    transform,
    domain: 'power.se',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      while (document.querySelector('div#product-list-load-more button.btn.btn-brand')) {
        const element = document.querySelector('div#product-list-load-more button.btn.btn-brand');
        element.scrollIntoView();
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.querySelector('div#product-list-load-more button.btn.btn-brand').click();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    });
    try {
      await context.waitForXPath('//div[contains(@class,"product-container")]');
    } catch (error) {
      console.log('All products not loaded after scrolling!!');
    }
    return await context.extract(productDetails, { transform });
  },
};
