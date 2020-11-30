const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'lookfantastic',
    transform: transform,
    domain: 'lookfantastic.com.au',
    zipcode: '',
  },
};
