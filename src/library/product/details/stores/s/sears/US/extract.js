const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'sears',
    transform,
    domain: 'sears.com',
    zipcode: "''",
  },
};
