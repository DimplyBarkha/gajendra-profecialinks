const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazonMweb',
    timeout: 9000,
    transform,
    domain: 'amazon.fr',
    zipcode: '',
  },
};
