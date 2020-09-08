const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'trademe',
    transform,
    domain: 'trademe.co.nz',
    zipcode: "''",
  },
};
