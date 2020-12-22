const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'farmaline',
    transform: transform,
    domain: 'farmaline.nl',
    zipcode: '',
  },
};
