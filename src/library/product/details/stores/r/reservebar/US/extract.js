const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    transform,
    domain: 'reservebar.com',
    zipcode: '',
  },
};
