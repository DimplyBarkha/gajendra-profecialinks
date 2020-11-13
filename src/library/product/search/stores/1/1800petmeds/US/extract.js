const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: '1800petmeds',
    transform: transform,
    domain: '1800petmeds.com',
    zipcode: '',
  },
};
