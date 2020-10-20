const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    transform: cleanUp,
    domain: 'whiteaway.com',
    zipcode: '',
  },
};

