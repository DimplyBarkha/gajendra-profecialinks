const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.de',
    zipcode: '',
  },
};
