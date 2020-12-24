const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'mumzworld',
    transform,
    domain: 'mumzworld.com',
    zipcode: '',
  },
};
