const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'jdsports',
    transform: transform,
    domain: 'jdsports.co.uk',
  },
  
};

