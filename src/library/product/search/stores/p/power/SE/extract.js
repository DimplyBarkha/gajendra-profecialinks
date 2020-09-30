const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'power',
    transform,
    domain: 'power.se',
    zipcode: '',
  },
};
