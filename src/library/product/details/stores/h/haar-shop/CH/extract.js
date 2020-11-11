const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    transform,
    domain: 'haar-shop.ch',
    zipcode: "''",
  },
};
