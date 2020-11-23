const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PK',
    store: 'hummart',
    transform,
    domain: 'hummart.pk',
    zipcode: "''",
  },
};
