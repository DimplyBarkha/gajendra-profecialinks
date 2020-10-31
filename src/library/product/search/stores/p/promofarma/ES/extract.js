const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform: cleanUp,
    domain: 'promofarma.com',
    zipcode: '',
  },
};
