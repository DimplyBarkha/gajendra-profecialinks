const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    transform,
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      if (document.querySelector('[data-action="main-image-click"]')) {
        document.querySelector('[data-action="main-image-click"]').click();
      }
    });
    await context.extract(productDetails);
  },
};
