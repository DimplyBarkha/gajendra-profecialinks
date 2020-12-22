const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'birite',
    transform,
    domain: 'birite.com.au',
  },
};
