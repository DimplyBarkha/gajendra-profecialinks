
const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform,
    domain: 'wayfair.com',
    zipcode: '',
  },
};
