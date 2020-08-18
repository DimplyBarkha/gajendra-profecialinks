const { transform } = require('../format');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'holtrenfrew',
    transform,
    domain: 'holtrenfrew.com',
    zipcode: '',
  },
};
