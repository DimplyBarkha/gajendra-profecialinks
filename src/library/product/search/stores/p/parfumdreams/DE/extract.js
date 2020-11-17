const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: null,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
};