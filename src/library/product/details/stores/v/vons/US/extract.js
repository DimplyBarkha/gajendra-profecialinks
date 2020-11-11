const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'vons',
    transform,
    domain: 'vons.com',
  },
};
