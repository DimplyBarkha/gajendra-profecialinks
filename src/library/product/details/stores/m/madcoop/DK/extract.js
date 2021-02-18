const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'madcoop',
    transform,
    domain: 'madcoop.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      if(document.querySelector('div.price-wrap')) {
        let pricePerUnit = document.querySelector('div.price-wrap').nextElementSibling ? document.querySelector('div.price-wrap').nextElementSibling.textContent.match(/(\d+)(\,)(\d+)|(\d+)/)[0] : null;
        document.body.setAttribute('priceperunit', pricePerUnit);
      }
    });
    await context.extract(productDetails);
  },
};
