const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    transform: cleanUp,
    domain: 'pacson.se',
    zipcode: '',
  },
};
