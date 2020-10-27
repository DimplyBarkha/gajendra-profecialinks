const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
};
