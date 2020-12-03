const {transform}=require('../SE/foramt')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'staples',
    transform,
    domain: 'staples.se',
    zipcode: '',
  },
};
