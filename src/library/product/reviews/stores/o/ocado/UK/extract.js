const { transform } = require('../../format');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    transform,
    domain: 'ocado.com',
    zipcode: '',
  },
};
