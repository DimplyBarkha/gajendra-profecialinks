
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'elgiganten',
    transform: transform,
    domain: 'elgiganten.dk',
    zipcode: '',
  },
};
