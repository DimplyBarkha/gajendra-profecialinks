const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GR',
    store: 'hondoscenter',
    transform: transform,
    domain: 'hondoscenter.com',
    zipcode: '',
  },
};
