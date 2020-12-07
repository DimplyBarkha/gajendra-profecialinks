const { transform } = require('../../../../shared');

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
