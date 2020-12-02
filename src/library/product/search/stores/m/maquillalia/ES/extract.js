const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'maquillalia',
    transform: transform,
    domain: 'maquillalia.com',
    zipcode: '',
  },
};
