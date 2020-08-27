const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'group-digital',
    transform,
    domain: 'group-digital.fr',
    zipcode: '',
  },
};
