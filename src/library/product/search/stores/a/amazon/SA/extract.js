const { transform } = require('../../../../transform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    transform,
    domain: 'amazon.sa',
    zipcode: '',
  },
  implementation,
};
