const {transform} = require('../NL/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'etos',
    transform,
    domain: 'etos.nl',
    zipcode: '',
  },
};
