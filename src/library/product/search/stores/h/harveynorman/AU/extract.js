const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.com.au',
    zipcode: '',
  },
};
