const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'importparfumerie',
    transform,
    domain: 'importparfumerie.ch',
    zipcode: "''",
  },
};
