const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'auchandrive',
    transform: transform,
    domain: 'auchandrive.fr',
  },
};
