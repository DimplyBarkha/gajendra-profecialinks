const { transform } = require('./format');
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NL',
    domain: 'drogistplein.nl',
    store: 'drogistplein',
    transform,
    zipcode: "''",
  },
};
