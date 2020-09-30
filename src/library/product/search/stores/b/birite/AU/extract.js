const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'birite',
    transform,
    domain: 'birite.com.au',
    zipcode: '',
  },
};
