const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'petburada',
    transform,
    domain: 'petburada.tr',
    zipcode: "''",
  },
};
