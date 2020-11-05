const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'rs-online',
    transform: cleanUp,
    domain: 'uk.rs-online.com',
    zipcode: '',
  },
};

