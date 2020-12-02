const {transform}=require('../CZ/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'makro',
    transform,
    domain: 'makro.cz',
    zipcode: '',
  },
};
