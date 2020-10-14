const {transform} = require('../format.js')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'bell',
    transform,
    domain: 'bell.ca',
    zipcode: '',
  },
};
