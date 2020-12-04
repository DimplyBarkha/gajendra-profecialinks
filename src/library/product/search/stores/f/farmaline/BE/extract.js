const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'farmaline',
    transform,
    domain: 'farmaline.be',
    zipcode: '',
  },
};
