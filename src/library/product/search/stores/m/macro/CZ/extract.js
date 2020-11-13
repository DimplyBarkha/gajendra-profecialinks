const {transform}=require('../CZ/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'macro',
    transform,
    domain: 'macro.cz',
    zipcode: '',
  },
};
