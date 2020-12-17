const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'druni',
    transform: transform,
    domain: 'druni.es',
    zipcode: '',
    url: 'https://www.druni.es/{id}',
  },
};
