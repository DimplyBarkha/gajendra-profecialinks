const { transform } = require('../../amazon/shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonApparel',
    transform,
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
