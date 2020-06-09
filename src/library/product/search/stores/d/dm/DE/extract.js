const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
  },
};
