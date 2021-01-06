const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'net-a-porter',
    transform,
    zipcode: '',
    domain: 'net-a-porter.com',
  },
};
