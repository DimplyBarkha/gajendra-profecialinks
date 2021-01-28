const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    transform,
    domain: 'worlddutyfree.com',
    zipcode: '',
  },
};
