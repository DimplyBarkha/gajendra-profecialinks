const { transform } = require('./format');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'hazesmokeshop',
    transform: transform,
    domain: 'hazesmokeshop.ca',
    zipcode: '',
  },
};
