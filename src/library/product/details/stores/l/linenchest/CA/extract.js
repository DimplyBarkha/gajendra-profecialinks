const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'linenchest',
    transform: transform,
    domain: 'linenchest.com',
    zipcode: '',
  },
};
