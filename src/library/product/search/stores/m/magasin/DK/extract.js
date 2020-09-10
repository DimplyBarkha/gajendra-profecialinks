const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    transform: transform,
    domain: 'magasin.dk',
    zipcode: '',
  },
};
