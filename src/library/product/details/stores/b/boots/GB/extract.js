const { transform } = require('../IE/transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GB',
    store: 'boots',
    transform,
    domain: 'boots.ie',
    zipcode: '',
  },
};
