const {transform}= require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    transform: null,
    domain: 'ocado.uk',
    zipcode: "''",
  },
};
