const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'abt',
    transform: cleanUp,
    domain: 'abt.com',
    zipcode: '',
  },
};
