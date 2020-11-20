const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'durstexpress',
    transform: cleanUp,
    domain: 'durstexpress.de',
    zipcode: '',
  },
};
