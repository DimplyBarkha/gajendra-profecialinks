const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes_lg',
    transform,
    domain: 'lowes.com',
  },
};
