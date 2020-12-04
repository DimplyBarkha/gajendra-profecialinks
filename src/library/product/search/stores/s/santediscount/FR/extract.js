const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    transform: transform,
    domain: 'santediscount.fr',
  },
};
