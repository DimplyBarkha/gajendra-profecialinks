const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'vitalsana',
    transform: cleanUp,
    domain: 'vitalsana.com',
    zipcode: '',
  },
};
