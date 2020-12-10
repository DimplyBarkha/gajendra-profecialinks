const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'officedepot',
    transform,
    domain: 'officedepot.fr',
    zipcode: '',
  },
};
