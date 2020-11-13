const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    transform: cleanUp,
    domain: 'flaschenpost.de',
    zipcode: '48151',
  },
};
