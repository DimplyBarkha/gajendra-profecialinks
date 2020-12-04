const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    transform: transform,
    domain: 'monsterpetsupplies.co.uk',
    zipcode: '',
  },
};
