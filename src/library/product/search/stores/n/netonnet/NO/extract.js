const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    transform:transform,
    domain: 'netonnet.no',
    zipcode: '',
  },
};
