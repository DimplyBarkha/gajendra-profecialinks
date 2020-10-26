const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'extra',
    transform,
    domain: 'extra.com',
    zipcode: "''",
  },
};
