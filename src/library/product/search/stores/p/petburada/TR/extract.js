const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'petburada',
    transform,
    domain: 'petburada.tr',
    zipcode: "''",
  },
};
