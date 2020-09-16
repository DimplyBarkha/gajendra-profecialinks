const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'bloomingdales',
    transform,
    domain: 'bloomingdales.ae',
    zipcode: '',
  },
};
