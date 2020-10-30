const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    transform,
    domain: 'namshi.com',
    zipcode: "''",
  },
};
