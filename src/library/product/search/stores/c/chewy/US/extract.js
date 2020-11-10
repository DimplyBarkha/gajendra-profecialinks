const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'chewy',
    transform: transform,
    domain: 'chewy.com',
    zipcode: '',
  },
};
