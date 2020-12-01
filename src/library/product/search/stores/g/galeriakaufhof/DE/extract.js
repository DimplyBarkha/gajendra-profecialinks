const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'galeriakaufhof',
    transform: transform,
    domain: 'galeria.de',
    zipcode: '',
  },
};
