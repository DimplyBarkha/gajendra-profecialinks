const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'supplyworks',
    transform,
    domain: 'supplyworks.us',
    zipcode: "''",
  },
};
