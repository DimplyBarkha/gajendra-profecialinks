const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform: cleanUp,
    domain: 'elgiganten.se',
    zipcode: '',
  },
};
