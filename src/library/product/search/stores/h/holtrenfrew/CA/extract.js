const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'holtrenfrew',
    transform,
    domain: 'holtrenfrew.com',
    zipcode: '',
  },
};
