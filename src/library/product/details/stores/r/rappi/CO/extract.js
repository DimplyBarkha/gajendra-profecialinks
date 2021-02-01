const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'rappi',
    transform: transform,
    domain: 'rappi.com.co',
    zipcode: '',
  },
};
