const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.co.uk',
    zipcode: '',
  },
};
