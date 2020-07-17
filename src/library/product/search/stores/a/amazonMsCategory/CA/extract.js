const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.ca',
    zipcode: '',
  },
};
