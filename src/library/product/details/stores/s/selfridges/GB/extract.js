const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GB',
    store: 'selfridges',
    transform: cleanUp,
    domain: 'selfridges.com',
    zipcode: '',
  },
};
