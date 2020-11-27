const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'hairshop',
    transform: transform,
    domain: 'hair-shop.com',
    zipcode: '',
  },
};