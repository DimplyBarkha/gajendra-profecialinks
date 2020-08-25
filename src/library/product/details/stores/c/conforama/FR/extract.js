const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'but',
    transform,
    domain: 'but.fr',
    zipcode: '',
  },
};
