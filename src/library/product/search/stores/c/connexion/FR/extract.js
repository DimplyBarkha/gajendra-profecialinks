const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'connexion',
    transform,
    domain: 'connexion.fr',
    zipcode: '',
  },
};
