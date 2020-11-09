const { transform } = require('./variantsShared');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
};
