const {transform}=require('../FR/foramt')
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
