const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.com.au',
    zipcode: '',
  },
};
