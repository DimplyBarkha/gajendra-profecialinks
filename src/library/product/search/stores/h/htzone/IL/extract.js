const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'htzone',
    transform: transform,
    domain: 'htzone.co.il',
    zipcode: '',
  },
};
