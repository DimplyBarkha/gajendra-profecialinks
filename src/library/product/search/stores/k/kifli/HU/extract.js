
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'kifli',
    transform: cleanUp,
    domain: 'kifli.hu',
    zipcode: '',
  },
};
