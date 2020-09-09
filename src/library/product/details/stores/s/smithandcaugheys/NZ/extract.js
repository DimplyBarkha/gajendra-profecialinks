const { cleanUp } = require('../../../../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'smithandcaugheys',
    transform: cleanUp,
    domain: 'smithandcaugheys.co.nz',
    zipcode: '',
  },
};
