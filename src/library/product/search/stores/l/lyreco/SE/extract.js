const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'lyreco',
    transform: cleanUp,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
