const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: '7now',
    transform,
    domain: '7now.com',
    zipcode: "''",
  },
};
