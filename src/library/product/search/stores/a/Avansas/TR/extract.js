const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'Avansas',
    transform: transform,
    domain: 'avansas.com',
    zipcode: "''",
  },
};
