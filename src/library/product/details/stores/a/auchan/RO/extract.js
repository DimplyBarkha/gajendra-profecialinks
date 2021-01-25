const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RO',
    store: 'auchan',
    transform: transform,
    domain: 'auchan.ro',
    zipcode: '',
  },
};
