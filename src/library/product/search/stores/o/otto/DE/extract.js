const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    transform: cleanUp,
    domain: 'otto.de',
    zipcode: '',
  },
};
