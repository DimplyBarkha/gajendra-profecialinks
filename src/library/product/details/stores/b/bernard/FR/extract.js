const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'bernard',
    transform: cleanUp,
    domain: 'bernard.fr',
    zipcode: '',
  },
};
