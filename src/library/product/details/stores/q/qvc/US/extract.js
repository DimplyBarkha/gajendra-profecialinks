const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    transform,
    domain: 'qvc.com',
    zipcode: '',
  },
};
