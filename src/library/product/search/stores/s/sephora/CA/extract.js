const {transform}=require('../CA/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
};
