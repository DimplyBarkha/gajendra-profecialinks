const { transform } = require('../IE/transform');
const { implementation } = require('../IE/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GB',
    store: 'boots',
    transform,
    domain: 'boots.ie',
    zipcode: '',
  },
  implementation,
};
