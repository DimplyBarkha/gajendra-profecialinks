const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'auchan',
    transform,
    domain: 'auchan.pt',
    zipcode: '',
  },
};
