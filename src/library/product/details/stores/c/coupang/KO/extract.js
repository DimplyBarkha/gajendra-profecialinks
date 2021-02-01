const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KO',
    store: 'coupang',
    transform,
    domain: 'coupang.com',
    zipcode: '',
  },
};
