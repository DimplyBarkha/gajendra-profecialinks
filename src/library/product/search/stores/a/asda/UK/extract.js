const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform,
    domain: 'groceries.asda.com',
  },
};
