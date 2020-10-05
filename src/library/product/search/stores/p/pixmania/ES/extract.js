const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'pixmania',
    transform: transform,
    domain: 'pixmania.es',
  },
};
