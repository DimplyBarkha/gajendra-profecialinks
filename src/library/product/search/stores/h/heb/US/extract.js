const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'heb',
    transform: transform,
    domain: 'heb.com',
    zipcode: '',
  },
};
