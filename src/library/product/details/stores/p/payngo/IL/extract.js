const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    transform,
    domain: 'payngo.co.il',
    zipcode: '',
  },
};
