const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    transform,
    domain: 'fwrd.com',
    zipcode: '',
  },
};
