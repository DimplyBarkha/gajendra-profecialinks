const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'lentillesmoinscheres',
    transform: transform,
    domain: 'lentillesmoinscheres.com',
    zipcode: '',
  },
};