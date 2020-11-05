const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'drogistplein',
    transform,
    domain: 'drogistplein.nl',
    zipcode: "''",
  },
};