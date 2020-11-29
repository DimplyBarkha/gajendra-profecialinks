const {transform}=require('../CH/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    transform,
    domain: 'marionnaud.ch',
    zipcode: '',
  },
};
