const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    transform: cleanUp,
    domain: 'marionnaud.fr',
    zipcode: '',
  },
};
