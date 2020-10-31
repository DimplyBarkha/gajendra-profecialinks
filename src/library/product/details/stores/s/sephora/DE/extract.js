const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'sephora',
    transform: cleanUp,
    domain: 'sephora.de',
    zipcode: '',
  },
};
