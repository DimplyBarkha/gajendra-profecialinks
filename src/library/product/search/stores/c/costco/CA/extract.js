const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform: cleanUp,
    domain: 'costco.ca',
    zipcode: '',
  },
};
