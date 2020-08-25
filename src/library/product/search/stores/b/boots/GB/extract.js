const { transform } = require('../../../../shared');
const { implementation } = require('../IE/extract');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GB',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation,
};
