const { transform } = require('../../../../shared');
const { implementation } = require('../US/extract');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'bedBathBeyond',
    transform,
    domain: 'bedbathandbeyond.ca',
    zipcode: '',
  },
  implementation,
};
