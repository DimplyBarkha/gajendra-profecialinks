const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'lyreco',
    transform: transform,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
