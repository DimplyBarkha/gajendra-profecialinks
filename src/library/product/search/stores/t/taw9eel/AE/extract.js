const {transform}=require('../AE/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'taw9eel',
    transform,
    domain: 'taw9eel.com',
    zipcode: '',
  },
};
