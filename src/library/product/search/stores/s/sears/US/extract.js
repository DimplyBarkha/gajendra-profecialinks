const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'sears',
    transform,
    domain: 'sears.com',
    zipcode: "''",
  },
};
