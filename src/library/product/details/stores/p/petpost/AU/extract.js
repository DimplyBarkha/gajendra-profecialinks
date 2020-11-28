const {transform}=require('../AU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'petpost',
    transform,
    domain: 'petpost.com.au',
    zipcode: '',
  },
};
