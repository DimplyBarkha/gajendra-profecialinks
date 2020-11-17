const {transform} = require('../CH/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    transform,
    domain: 'marionnaud.ch',
    zipcode: '',
  },
};
