const {transform}=require('../PL/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'makro',
    transform,
    domain: 'makro.pl',
    zipcode: '',
  },
};
