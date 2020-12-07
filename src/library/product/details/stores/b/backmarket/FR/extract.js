const { transform } = require('../../../../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    transform: transform,
    domain: 'backmarket.fr',
    zipcode: '',
  },
};
