const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'mda',
    transform,
    domain: 'mda-electromenager.com',
    zipcode: '',
  },
};
