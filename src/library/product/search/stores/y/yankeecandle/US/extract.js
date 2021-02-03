const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'yankeecandle',
    transform: transform,
    domain: 'yankeecandle.com',
    zipcode: '', 
  },
};
