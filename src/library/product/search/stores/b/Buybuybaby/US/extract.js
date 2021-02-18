const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'Buybuybaby',
    transform,
    domain: 'buybuybaby.com',
    zipcode: '',
  },
};
