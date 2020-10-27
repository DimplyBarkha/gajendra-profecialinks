const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'extra',
    transform,
    domain: 'extra.com',
    zipcode: "''",
  },
};
