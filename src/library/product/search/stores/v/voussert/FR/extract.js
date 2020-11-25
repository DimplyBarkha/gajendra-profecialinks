const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'voussert',
    transform,
    domain: 'voussert.fr',
    zipcode: '',
  },
};
