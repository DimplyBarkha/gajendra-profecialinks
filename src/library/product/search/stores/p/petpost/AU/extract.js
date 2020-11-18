const {transform}=require('../AU/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'petpost',
    transform,
    domain: 'petpost.com.au',
    zipcode: '',
  },
};
