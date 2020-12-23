const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    transform: cleanUp,
    domain: 'freshamazon.de',
    zipcode: '',
  },
};
