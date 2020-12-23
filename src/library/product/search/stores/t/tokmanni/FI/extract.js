const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    transform: cleanUp,
    domain: 'tokmanni.fi',
    zipcode: '',
  },
};
