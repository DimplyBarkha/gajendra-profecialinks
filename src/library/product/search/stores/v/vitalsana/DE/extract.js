const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'vitalsana',
    transform: cleanUp,
    domain: 'vitalsana.com',
    zipcode: '',
  },
};
