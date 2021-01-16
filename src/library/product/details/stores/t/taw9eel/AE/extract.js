const {transform}=require('../AE/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'taw9eel',
    transform,
    domain: 'taw9eel.com',
    zipcode: '',
  },
};
