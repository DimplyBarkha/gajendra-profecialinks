const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    transform: cleanUp,
    domain: 'jbhifi.com.au',
    zipcode: '',
  },
};
