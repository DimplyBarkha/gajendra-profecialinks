const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    transform: cleanUp,
    domain: 'notino.de',
    zipcode: '',
  },
};
