const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'williams-sonoma',
    transform,
    domain: 'williams-sonoma.com',
    zipcode: '',
  },
};
