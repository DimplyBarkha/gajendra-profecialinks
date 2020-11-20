const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    transform,
    domain: 'n11.com',
    zipcode: '',
  },
};
