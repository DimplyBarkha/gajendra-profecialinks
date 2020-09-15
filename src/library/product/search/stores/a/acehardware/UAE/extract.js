const { transform } = require('././../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    transform: transform,
    domain: 'aceuae.com',
    zipcode: '',
  },
};
