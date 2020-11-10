
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'dosfarma',
    transform: cleanUp,
    domain: 'dosfarma.com',
    zipcode: '',
  },
};
