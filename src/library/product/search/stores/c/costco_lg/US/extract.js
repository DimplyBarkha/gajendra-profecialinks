const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'costco_lg',
    transform,
    domain: 'costco.com',
  },
};
