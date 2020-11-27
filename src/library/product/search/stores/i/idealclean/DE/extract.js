const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'idealclean',
    transform: transform,
    domain: 'ideal_clean.de',
  },
  
};

