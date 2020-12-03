const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'Mall',
    transform: transform,
    domain: 'mall.cz',
    zipcode: '',
  },
};
