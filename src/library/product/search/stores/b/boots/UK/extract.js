const { transform } = require('../../../../shared');
const { implementation } = require('../IE/extract');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation,
};
