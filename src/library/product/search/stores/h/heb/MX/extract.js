const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'heb',
    transform: transform,
    domain: 'heb.com',
    zipcode: '',
  },
};
