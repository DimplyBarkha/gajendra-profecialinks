const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    transform,
    domain: 'betta.com.au'
  },
};
