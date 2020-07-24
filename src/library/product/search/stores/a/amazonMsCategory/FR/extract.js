const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.fr',
    zipcode: '',
  },
};
