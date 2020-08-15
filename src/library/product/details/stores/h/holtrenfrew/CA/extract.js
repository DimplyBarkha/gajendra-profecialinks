const { transform } = require("../format");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'holtrenfrew',
    transform,
    domain: 'holtrenfrew.com',
    zipcode: '',
  },
};
