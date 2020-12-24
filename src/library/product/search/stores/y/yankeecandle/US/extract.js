const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'yankeecandle',
    transform: cleanUp,
    domain: 'yankeecandle.com',
    zipcode: '',
  },
};
