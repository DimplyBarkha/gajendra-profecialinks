const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'epocacosmeticos',
    transform,
    domain: 'epocacosmeticos.com',
    zipcode: '',
  },
};
