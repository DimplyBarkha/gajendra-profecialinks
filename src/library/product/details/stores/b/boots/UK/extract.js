const { transform } = require('../IE/transform');
const { implementation } = require('../IE/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.ie',
    zipcode: '',
  },
  implementation,
};
