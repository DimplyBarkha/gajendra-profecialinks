const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'empik',
    transform,
    domain: 'empik.com',
    zipcode: '',
  },
};
