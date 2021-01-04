const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'totalwine_95825',
    transform,
    zipcode: '95825',
    domain: 'totalwine.com',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(async () => {
      const currentPageURL = window.location.href;
      const bodyElement = document.querySelector('body');
      if (bodyElement) {
        bodyElement.setAttribute('current_page_url', currentPageURL);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
