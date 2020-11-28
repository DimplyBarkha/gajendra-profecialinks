const {transform} = require('../AU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'bunnings',
    transform,
    domain: 'bunnings.com.au',
    zipcode: '',
  },
};
