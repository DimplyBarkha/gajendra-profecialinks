const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    transform: cleanUp,
    domain: 'primor.eu',
    zipcode: '',
  },
};
