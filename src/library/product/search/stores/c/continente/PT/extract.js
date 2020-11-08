const {transform} = require('../PT/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'continente',
    transform,
    domain: 'continente.pt',
    zipcode: '',
  },
};
