const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'farmaline_nl',
    transform: transform,
    domain: 'farmaline.be',
    zipcode: '',
  },
};
