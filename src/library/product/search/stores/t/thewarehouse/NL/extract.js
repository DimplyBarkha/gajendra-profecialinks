const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'thewarehouse',
    transform,
    domain: 'thewarehouse.co.nz',
    zipcode: "''",
  },
};
