const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ulta',
    transform,
    domain: 'ulta.us',
    zipcode: '',
  },
};
