const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: transform,
    domain: 'waitrose.com',
  },
};
