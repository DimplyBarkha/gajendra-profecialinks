const {transform} = require('./transform')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    transform: transform,
    domain: 'magasin.dk',
    zipcode: '',
  },
};
