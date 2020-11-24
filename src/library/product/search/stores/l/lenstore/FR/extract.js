const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'lenstore',
    transform: transform,
    domain: 'lenstore.fr',
    zipcode: '',
  },
};
