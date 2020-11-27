const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'supplyworks',
    transform,
    domain: 'supplyworks.us',
    zipcode: "''",
  },
};
