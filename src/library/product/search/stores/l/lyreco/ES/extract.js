const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'lyreco',
    transform: transform,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
