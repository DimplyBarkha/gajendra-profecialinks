const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'senea',
    transform,
    domain: 'senea.fr',
    zipcode: '',
  },
};
