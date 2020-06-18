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
      // Get additional feature bullets
      let featureBullets = Array.from(document.querySelectorAll('#feature-bullets > ul > li > span')).map(elm => {
        if (!elm.querySelector('#replacementPartsFitmentBulletInner')) {
          const value = elm.textContent.trim();
          return `${value}`;
        }
      }).filter(elm => elm).join(' || ');
      document.body.setAttribute('feature_bullets', featureBullets);
    });
    await context.extract(productDetails);
  },
};
