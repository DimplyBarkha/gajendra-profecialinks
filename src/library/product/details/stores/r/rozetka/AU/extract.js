const {transform}=require('../AU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'rozetka',
    transform,
    domain: 'rozetka.com.ua',
    zipcode: '',
  },
};
