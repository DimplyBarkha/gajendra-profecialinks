const {transform}=require('../AU/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'woolworths_sydney',
    transform,
    domain: 'woolworths.com.au',
    zipcode: '',
  },
};
