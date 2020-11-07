const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PK',
    store: 'daraz',
    transform,
    domain: 'daraz.pk',
    zipcode: "''",
  },
};
