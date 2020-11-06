const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    transform,
    domain: 'alza.cz',
    zipcode: '',
  },
};
