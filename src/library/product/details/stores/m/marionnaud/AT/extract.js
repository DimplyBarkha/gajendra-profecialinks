const {transform}=require('../AT/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    transform,
    domain: 'marionnaud.at',
    zipcode: '',
  },
};
