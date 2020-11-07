const {transform} = require('../NL/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bidfood',
    transform,
    domain: 'bidfood.nl',
    zipcode: '',
  },
};
