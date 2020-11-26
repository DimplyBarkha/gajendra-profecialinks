const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    transform,
    domain: 'thebay.com',
    zipcode: '',
  },
};
