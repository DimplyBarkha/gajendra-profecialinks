const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'apotea',
    transform,
    domain: 'apotea.se',
    zipcode: '',
  },
};
