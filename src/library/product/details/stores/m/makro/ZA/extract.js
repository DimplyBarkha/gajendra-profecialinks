const {transform}=require('../ZA/format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'makro',
    transform,
    domain: 'makro.co.za',
    zipcode: '',
  },
};
