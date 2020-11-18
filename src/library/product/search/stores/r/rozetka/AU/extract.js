const {transform}=require('../AU/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'rozetka',
    transform,
    domain: 'rozetka.com.ua',
    zipcode: '',
  },
};
