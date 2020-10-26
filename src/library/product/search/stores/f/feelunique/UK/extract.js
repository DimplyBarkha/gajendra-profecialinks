const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    transform: cleanUp,
    domain: 'feelunique.com',
    zipcode: '',
  },
};
