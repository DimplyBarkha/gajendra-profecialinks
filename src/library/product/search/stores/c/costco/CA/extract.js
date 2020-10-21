const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform: transform,
    domain: 'costco.ca',
    zipcode: '',
  },
};
