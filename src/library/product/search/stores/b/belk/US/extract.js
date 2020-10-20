const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'belk',
    transform,
    domain: 'belk.com',
    zipcode: '',
  },
};
