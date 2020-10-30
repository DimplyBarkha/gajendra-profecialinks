const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'amicafarmacia',
    transform,
    domain: 'amicafarmacia.com',
    zipcode: "''",
  },
};
