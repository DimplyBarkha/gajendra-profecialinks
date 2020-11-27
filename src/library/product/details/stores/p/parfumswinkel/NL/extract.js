const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'parfumswinkel',
    transform,
    domain: 'parfumswinkel.nl',
    zipcode: "''",
  },
};
