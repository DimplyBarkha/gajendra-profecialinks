const {transform}=require('../FR/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'staples',
    transform,
    domain: 'jpg.fr',
    zipcode: '',
  },
};
