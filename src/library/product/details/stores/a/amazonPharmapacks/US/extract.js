const { amazonTransform } = require('../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPharmapacks',
    transform: amazonTransform,
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      return true;
    });
    await context.click('[data-action="main-image-click"]');
    await context.extract(productDetails);
  },
};
