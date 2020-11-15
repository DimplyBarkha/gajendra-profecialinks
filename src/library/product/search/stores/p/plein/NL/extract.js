const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    transform: transform,
    domain: 'plein.nl',
    zipcode: "''",
  },
};
