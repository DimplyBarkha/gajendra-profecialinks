const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform: transform,
    domain: 'superdrug.com',
  },
};
