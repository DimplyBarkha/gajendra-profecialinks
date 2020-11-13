const {transform}=require('../CZ/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'makro',
    transform,
    domain: 'makro.cz',
    zipcode: '',
  },
};
