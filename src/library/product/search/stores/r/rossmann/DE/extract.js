const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    transform,
    domain: 'rossmann.de',
    zipcode: '',
  },
};
