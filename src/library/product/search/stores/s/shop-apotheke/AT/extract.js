const {transform}=require('../AT/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.com',
    zipcode: '',
  },
};
