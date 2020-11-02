const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'azrieli',
    transform: transform,
    domain: 'azrieli.com',
    zipcode: '',
  },
};
