const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    transform: transform,
    domain: 'amazon.com',
    zipcode: '',
  },
};
