const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    transform: transform,
    domain: 'rewe.de',
    zipcode: "''",
  },
};
