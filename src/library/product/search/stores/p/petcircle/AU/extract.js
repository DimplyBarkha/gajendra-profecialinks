const { transform } = require('../AU/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'petcircle',
    transform,
    domain: 'petcircle.com.au',
    zipcode: '',
  },
};