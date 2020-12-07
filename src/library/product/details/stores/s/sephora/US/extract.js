const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform: transform,
    domain: 'sephora.com',
    zipcode: '',
  },
};
