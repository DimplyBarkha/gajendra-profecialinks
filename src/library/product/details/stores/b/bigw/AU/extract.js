const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'bigw',
    transform,
    domain: 'bigw.com.au',
    zipcode: '',
  },
};
