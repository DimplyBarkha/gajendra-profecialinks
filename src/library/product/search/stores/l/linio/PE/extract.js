const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    transform,
    domain: 'linio.com',
    zipcode: '',
  },
};
