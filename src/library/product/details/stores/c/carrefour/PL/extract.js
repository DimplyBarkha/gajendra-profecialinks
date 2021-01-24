const {transform}=require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'carrefour',
    transform,
    domain: 'carrefour.pl',
    zipcode: '',
  },
};
