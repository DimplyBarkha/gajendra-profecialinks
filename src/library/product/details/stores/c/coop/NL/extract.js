const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'coop',
    transform,
    domain: 'coop.nl',
    zipcode: '',
  },
};
