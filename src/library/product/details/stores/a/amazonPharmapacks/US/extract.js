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
        if(document.querySelector('[data-action="main-image-click"]')) {
            document.querySelector('[data-action="main-image-click"]').click();
        }
    });
    await context.extract(productDetails);
  },
};
