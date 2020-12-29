const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'amazon',
    transform,
    domain: 'amazon.com.br',
    zipcode: '',
  },
  implementation,
};
