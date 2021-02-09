const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'larebajavirtual',
    transform: transform,
    domain: 'larebajavirtual.com',
    zipcode: '',
  },
};
