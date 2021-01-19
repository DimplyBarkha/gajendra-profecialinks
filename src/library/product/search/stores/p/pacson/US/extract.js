const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'pacson',
    transform: cleanUp,
    domain: 'pacson.se',
    zipcode: '',
  },
};
