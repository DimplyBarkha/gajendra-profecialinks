const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform: cleanUp,
    domain: 'selfridges.com',
    zipcode: '',
  },
};
