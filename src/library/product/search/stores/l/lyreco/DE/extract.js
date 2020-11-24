const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'lyreco',
    transform: transform,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
