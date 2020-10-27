const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    transform: cleanUp,
    domain: 'meijer.com',
    zipcode: '',
  },
};
