const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'trademe',
    transform,
    domain: 'trademe.co.nz',
    zipcode: "''",
  },
};
