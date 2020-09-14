const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: transform,
    domain: 'nykaa.com',
    zipcode: '',
  },
};