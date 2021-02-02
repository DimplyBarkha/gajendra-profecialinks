const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'bernard',
    transform: transform,
    domain: 'bernard.fr',
    zipcode: '',
  },
};