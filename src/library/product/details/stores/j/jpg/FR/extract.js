const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    transform: cleanUp,
    domain: 'jpg.fr',
    zipcode: '',
  },
};