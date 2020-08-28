const {transform} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.com.au',
    zipcode: '',
  },
};
