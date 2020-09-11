const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },

  // implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //     if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
  //       document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
  //     }
  //   });
  //   await context.extract(productDetails);
  // },
};
