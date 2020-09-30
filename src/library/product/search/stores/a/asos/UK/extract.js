const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform: transform,
    domain: 'asos.com',
  },
};
