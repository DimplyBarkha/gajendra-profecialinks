const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'jccampbellelectrics',
    transform: transform,
    domain: 'jccampbellelectrics.com',
    zipcode: '',
  },
};
