const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.de',
    zipcode: '',
  },
};
