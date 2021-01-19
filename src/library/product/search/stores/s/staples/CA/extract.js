const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'staples',
    transform: null,
    domain: 'staples.ca',
    zipcode: "''",
  },
};
