const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'connection',
    transform: transform,
    domain: 'connection.com',
    zipcode: '',
  },
};
