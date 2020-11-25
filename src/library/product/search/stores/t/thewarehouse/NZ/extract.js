const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'thewarehouse',
    transform,
    domain: 'thewarehouse.co.nz',
    zipcode: "''",
  },
};
