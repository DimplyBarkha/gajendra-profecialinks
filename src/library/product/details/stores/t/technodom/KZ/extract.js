const {transform}=require('../KZ/format.js')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KZ',
    store: 'technodom',
    transform,
    domain: 'technodom.kz',
    zipcode: '',
  },
};
