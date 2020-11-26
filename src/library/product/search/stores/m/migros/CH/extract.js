const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    transform: transform,
    domain: 'migros.ch',
    zipcode: '',
  },
};
