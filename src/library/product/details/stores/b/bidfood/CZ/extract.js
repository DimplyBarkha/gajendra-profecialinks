const {transform}=require('../CZ/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'bidfood',
    transform,
    domain: 'mujbidfood.cz',
    zipcode: '',
  },
};
