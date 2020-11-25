const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NM',
    store: 'luluwebstore',
    transform: transform,
    domain: 'luluhypermarket.com',
    zipcode: '',
  },
};
