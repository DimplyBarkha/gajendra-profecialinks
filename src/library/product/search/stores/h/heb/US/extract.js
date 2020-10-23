const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'heb',
    transform: cleanUp,
    domain: 'heb.com',
    zipcode: '',
  },
};
