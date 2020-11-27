
const { transform } = require('../format.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'apotal',
    transform: transform,
    domain: 'apotal.de',
    zipcode: '',
  },
};
