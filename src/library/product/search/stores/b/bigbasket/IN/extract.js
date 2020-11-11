const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'bigbasket',
    transform,
    domain: 'bigbasket.in',
    zipcode: '',
  },
};
