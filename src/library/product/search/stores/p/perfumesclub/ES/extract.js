const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'perfumesclub',
    transform: transform,
    domain: 'perfumesclub.com',
    zipcode: '',
  },
};
