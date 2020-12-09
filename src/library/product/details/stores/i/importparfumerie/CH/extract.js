const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'importparfumerie',
    transform,
    domain: 'importparfumerie.ch',
    zipcode: "''",
  },
};
