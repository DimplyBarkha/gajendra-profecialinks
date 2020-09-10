const { transform } = require('../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: '',
    store: 'stockmann',
    transform: transform,
    domain: 'stockmann.com',
  },
};
