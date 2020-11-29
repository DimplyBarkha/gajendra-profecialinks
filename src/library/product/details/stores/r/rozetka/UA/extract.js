const {transform}=require('../UA/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UA',
    store: 'rozetka',
    transform,
    domain: 'rozetka.com.ua',
    zipcode: '',
  },
};
