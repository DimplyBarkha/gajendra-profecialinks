const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'JD_Sports',
    transform: transform,
    domain: 'jdsports.co.uk',
  },
  
};

