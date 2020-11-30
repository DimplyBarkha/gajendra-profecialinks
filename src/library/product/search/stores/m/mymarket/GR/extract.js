const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GR',
    store: 'mymarket',
    transform,
    domain: 'mymarket.gr',
    zipcode: "''",
  },
};
