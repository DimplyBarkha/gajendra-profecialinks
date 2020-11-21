const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    transform,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
};
