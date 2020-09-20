const { transform } = require('./transform');
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
