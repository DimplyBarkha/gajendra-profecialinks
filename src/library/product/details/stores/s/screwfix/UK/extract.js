const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'screwfix',
    transform,
    domain: 'screwfix.com',
    zipcode: "''",
  },
};
