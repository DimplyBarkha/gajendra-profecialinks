const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'chemistdirect',
    transform,
    domain: 'chemistdirect.co.uk',
    zipcode: '',
  },
};
