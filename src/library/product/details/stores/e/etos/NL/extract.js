const {transform} = require('../NL/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'etos',
    transform,
    domain: 'etos.nl',
    zipcode: '',
  },
};
