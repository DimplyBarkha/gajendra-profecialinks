const { cleanUp } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'neimanmarcus',
    transform: cleanUp,
    zipcode: '',
    domain: 'neimanmarcus.com',
  },
};
