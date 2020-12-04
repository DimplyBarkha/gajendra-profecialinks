const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'nofrills',
    transform,
    domain: 'nofrills.ca',
    zipcode: '',
  },
};
