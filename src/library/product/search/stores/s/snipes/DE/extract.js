const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    transform: cleanUp,
    domain: 'snipes.com',
    zipcode: '',
  },
};
