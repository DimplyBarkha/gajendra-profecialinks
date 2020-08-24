const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'but',
    transform,
    domain: 'but.fr',
    zipcode: '',
  },
};
