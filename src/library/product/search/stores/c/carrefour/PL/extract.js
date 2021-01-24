const {transform}=require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'carrefour',
    transform,
    domain: 'carrefour.pl',
    zipcode: '',
  },
};
