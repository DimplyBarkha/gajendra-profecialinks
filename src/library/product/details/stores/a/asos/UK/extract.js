const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform: cleanUp,
    domain: 'asos.com',
    zipcode: '',
  },
};