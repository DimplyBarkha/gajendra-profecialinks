const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
};
