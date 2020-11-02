const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'avansas',
    transform: transform,
    domain: 'avansas.com',
    zipcode: "''",
  },
};
