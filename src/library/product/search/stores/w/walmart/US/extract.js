const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform: transform,
    domain: 'walmart.com',
  },
};
