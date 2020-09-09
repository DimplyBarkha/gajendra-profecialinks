const { transform } = require('./../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    transform,
    domain: 'netonnet.no',
    zipcode: '',
  },
};
