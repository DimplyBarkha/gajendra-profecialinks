const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'nemlig',
    transform,
    domain: 'nemlig.com',
    zipcode: '',
  },
};
