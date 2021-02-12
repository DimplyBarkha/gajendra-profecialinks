const { transform } = require('../UA/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UA',
    store: 'metro',
    transform,
    domain: 'metro.ua',
    zipcode: '',
  },
};
