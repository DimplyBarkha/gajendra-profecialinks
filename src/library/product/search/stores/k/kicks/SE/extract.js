const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'kicks',
    transform: cleanUp,
    domain: 'kicks.se',
    zipcode: '',
  },
};