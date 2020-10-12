const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'apopro',
    transform,
    domain: 'apopro.dk',
    zipcode: '',
  },
};
