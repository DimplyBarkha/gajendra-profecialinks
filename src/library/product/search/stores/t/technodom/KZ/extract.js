const {transform}=require('../KZ/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'KZ',
    store: 'technodom',
    transform,
    domain: 'technodom.kz',
    zipcode: '',
  },
};
