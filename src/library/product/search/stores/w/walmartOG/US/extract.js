const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    transform: transform,
    domain: 'grocery.walmart.com',
  },
};
