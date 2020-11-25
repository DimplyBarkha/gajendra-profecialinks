const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    transform: transform,
    domain: 'lookfantastic.com',
    zipcode: ''
  },
};
