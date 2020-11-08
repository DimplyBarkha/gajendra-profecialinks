const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    transform: cleanUp,
    domain: 'lomax.dk',
    zipcode: '',
  },
};
