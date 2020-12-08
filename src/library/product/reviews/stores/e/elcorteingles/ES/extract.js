
const { transform } = require('../ES/shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
