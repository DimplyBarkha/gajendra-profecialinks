const {transform}=require('../SE/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'staples',
    transform,
    domain: 'staples.se',
    zipcode: '',
  },
};
