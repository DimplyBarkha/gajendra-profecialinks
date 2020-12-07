const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    transform,
    domain: 'amazon.sa',
  },
};
