const { amazonTransform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    transform: amazonTransform,
    store: 'amazonPharmapacks',
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: amazonTransform }, context, { productDetails }) => {
    const clickAction = await context.evaluate(async function () {
      return document.querySelector('*[data-action="main-image-click"]');
    });
    if (clickAction) {
      await context.click('[data-action="main-image-click"]');
    }
    await context.extract(productDetails, { transform: amazonTransform });
  },
};
