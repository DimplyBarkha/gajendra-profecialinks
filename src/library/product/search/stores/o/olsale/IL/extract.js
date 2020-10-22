const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'olsale',
    transform: transform,
    domain: 'olsale.co.il',
    zipcode: '',
  },
};
