const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'screwfix',
    transform,
    domain: 'screwfix.com',
    zipcode: "''",
  },
};