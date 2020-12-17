const {transform}=require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    transform,
    domain: 'electronic4you.at',
    zipcode: '',
  },
};
