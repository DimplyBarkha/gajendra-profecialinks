const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'campoluzenoteca',
    transform: cleanUp,
    domain: 'campoluzenoteca.com',
    zipcode: '',
  },
};
