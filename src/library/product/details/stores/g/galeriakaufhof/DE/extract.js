const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'galeriakaufhof',
    transform: cleanUp,
    domain: 'galeria.de',
    zipcode: '',
  },
};
