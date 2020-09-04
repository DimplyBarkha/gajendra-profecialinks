const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    transform: transform,
    domain: 'neonet.pl',
    zipcode: '',
  },
};
