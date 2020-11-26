const {transform}=require('../FR/foramt')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'staples',
    transform,
    domain: 'jpg.fr',
    zipcode: '',
  },
};
