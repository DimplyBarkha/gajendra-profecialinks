const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    transform: transform,
    domain: 'costco.com',
  },
};
