const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: '7now',
    transform,
    domain: '7now.com',
    zipcode: '',
  },
};
