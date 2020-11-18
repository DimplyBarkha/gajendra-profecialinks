const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'lyreco',
    transform: transform,
    domain: 'lyreco.fr',
  },
  
};

