const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'baligam',
    transform: transform,
    domain: 'baligam.co.il',
    zipcode: '',
  },
};
