const {transform}=require('../PL/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'makro',
    transform,
    domain: 'makro.pl',
    zipcode: '',
  },
};
