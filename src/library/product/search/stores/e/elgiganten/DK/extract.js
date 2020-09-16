
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'elgiganten',
    transform,
    domain: 'elgiganten.dk',
    zipcode: '',
  },
};
