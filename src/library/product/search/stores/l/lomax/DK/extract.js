const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    transform: transform,
    domain: 'lomax.dk',
    zipcode: '',
  },
};