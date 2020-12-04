const {transform} = require('../AU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'WoolworthsonlineWarringahMall',
    transform,
    domain: 'woolworths.com.au',
    zipcode: '',
  },
};
