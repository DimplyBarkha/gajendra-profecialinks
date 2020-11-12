const {transform}=require('../CO/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'farmatodo',
    transform,
    domain: 'farmatodo.com.co',
    zipcode: '',
  },
};