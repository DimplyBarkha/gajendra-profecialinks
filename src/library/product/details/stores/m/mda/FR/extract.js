const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'mda',
    transform,
    domain: 'mda-electromenager.com',
    zipcode: '',
  },
};
