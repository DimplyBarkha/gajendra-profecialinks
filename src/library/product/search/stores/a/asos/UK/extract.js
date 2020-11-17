
const { transform } = require('../../../../shared');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform: transform,
    domain: 'asos.com',
  },
  implementation,
};
