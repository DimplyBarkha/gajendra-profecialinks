const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'carphonewarehouse',
    transform: transform,
    domain: 'carphonewarehouse.com',
    zipcode: '',
  },
};
