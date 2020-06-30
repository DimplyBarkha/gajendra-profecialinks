const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.de',
    timeout: 8000,
    zipcode: '',
  },
};
