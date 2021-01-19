const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    transform: cleanUp,
    domain: 'tokmanni.fi',
    zipcode: '',
  },
};
