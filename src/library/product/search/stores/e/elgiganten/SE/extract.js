
const { transform } = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform,
    domain: 'elgiganten.se',
    zipcode: '',
  },
};
