const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro_lovela',
    transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
};
