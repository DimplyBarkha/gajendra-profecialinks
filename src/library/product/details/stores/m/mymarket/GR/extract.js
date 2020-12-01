const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GR',
    store: 'mymarket',
    transform,
    domain: 'mymarket.gr',
    zipcode: "''",
  },
};
