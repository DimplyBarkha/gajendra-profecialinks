const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'coop',
    transform,
    domain: 'coop.se',
    zipcode: '',
  },
};
