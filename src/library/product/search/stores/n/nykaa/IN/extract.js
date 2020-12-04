const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform,
    domain: 'nykaa.com',
    zipcode: '',
  },
};
