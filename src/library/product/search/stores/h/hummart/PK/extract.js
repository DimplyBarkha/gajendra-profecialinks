const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PK',
    store: 'hummart',
    transform,
    domain: 'hummart.pk',
    zipcode: "''",
  },
};