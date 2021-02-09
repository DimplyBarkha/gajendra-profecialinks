const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'zalando',
    transform,
    domain: 'zalando.fr',
    zipcode: '',
  },
};