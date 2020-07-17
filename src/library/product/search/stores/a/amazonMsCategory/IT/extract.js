const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.it',
    zipcode: '',
  },
};
