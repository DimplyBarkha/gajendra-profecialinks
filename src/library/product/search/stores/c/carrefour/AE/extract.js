const {transform} = require('./format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    transform,
    domain: 'carrefouruae.com',
    zipcode: "''",
  },
};
