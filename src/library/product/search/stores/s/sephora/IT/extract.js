const {transform}=require('../IT/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
};
