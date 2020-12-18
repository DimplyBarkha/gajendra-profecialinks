const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform,
    domain: 'lowes.com',
    zipcode: '',
  },
};
