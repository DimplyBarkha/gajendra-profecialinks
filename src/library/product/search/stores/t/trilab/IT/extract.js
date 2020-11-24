const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'trilab',
    transform,
    domain: 'trilab.it',
    zipcode: "''",
  },
};
