const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    transform,
    domain: 'payngo.co.il',
    zipcode: '',
  },
};
