const {transform} = require('../AU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'petcircle',
    transform,
    domain: 'petcircle.com.au',
    zipcode: '',
  },
};