const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'newworld',
    transform,
    domain: 'newworld.co.nz',
    zipcode: "''",
  },
};
