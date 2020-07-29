
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    transform,
    zipcode: '',
    domain: 'elcorteingles.es',
  },
};
