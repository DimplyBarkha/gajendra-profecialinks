const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'shoprite_08096',
    transform: transform,
    domain: 'shoprite.com',
    zipcode: '',
  },
};
