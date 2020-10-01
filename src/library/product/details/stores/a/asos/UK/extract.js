const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform,
    domain: 'asos.com',
    zipcode: '',
  },
};