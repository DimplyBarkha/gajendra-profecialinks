const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bell',
    transform,
    domain: 'bell.ca',
    zipcode: '',
  },
};
