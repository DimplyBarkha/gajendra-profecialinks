const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    transform,
    domain: 'ubaldi.com',
    zipcode: '',
  }
};
