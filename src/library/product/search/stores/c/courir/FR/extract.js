const { transform } = require('./../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'courir',
    transform,
    domain: 'courir.com',
  },
};
