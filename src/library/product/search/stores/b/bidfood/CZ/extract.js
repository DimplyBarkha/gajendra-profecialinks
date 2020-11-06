const {transform} = require('../CZ/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'bidfood',
    transform,
    domain: 'mujbidfood.cz',
    zipcode: '',
  },
};
