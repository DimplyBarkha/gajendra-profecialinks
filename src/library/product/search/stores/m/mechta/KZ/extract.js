const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    transform,
    domain: 'mechta.kz',
    zipcode: "''",
  },
};
