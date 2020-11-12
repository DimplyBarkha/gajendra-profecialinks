const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes_1360',
    transform,
    domain: 'lowes.com',
  },
};
