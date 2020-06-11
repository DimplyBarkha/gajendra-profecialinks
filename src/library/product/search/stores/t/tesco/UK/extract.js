const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    transform: transform,
    domain: 'tesco.com',
  },
};
