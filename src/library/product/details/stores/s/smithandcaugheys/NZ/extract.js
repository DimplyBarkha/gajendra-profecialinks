const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'smithandcaugheys',
    transform,
    domain: 'smithandcaugheys.co.nz',
    zipcode: '',
  },
};
