const { cleanUp } = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'bezokularow',
    transform: cleanUp,
    domain: 'bezokularow.pl',
    zipcode: '',
  },
};
