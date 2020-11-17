const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'marmot',
    transform,
    domain: 'marmot.com',
    zipcode: "''",
  },
};
