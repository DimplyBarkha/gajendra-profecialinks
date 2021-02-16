const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'sephora',
    transform,
    domain: 'sephora.fr',
    zipcode: '',
  },
};
