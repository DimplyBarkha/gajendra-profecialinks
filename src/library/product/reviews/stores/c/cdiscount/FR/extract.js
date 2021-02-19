const { transform } = require('./shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    transform,
    domain: 'cdiscount.fr',
    zipcode: '',
  },
};
