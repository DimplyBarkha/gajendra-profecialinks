const {transform}=require('../AT/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.at',
    zipcode: '',
  },
};
