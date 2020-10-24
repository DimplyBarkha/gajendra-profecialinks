const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'fragrancedirect',
    transform: transform,
    domain: 'fragrancedirect.co.uk',
    zipcode: "''",
  },
};
