const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'voussert',
    transform,
    domain: 'voussert.fr',
    zipcode: '',
  },
};
