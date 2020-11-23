const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'jumbo',
    transform,
    domain: 'jumbo.ar',
    zipcode: '',
  },
};
