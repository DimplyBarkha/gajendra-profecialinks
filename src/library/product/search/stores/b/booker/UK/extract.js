const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    transform: transform,
    domain: 'booker.co.uk',
  },
};
