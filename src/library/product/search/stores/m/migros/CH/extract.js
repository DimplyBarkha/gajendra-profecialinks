const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    transform,
    domain: 'migros.ch',
    zipcode: '',
  },
};
