const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'linsenmax',
    transform,
    domain: 'linsenmax.ch',
    zipcode: "''",
  },
};
