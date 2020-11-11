const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform,
    domain: 'fust.ch',
    zipcode: "''",
  },
};
