const {transform}=require('../UA/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UA',
    store: 'rozetka',
    transform,
    domain: 'rozetka.com.ua',
    zipcode: '',
  },
};
