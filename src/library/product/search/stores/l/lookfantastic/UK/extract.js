const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    transform: cleanUp,
    domain: 'lookfantastic.com',
    zipcode: ''
  },
};
