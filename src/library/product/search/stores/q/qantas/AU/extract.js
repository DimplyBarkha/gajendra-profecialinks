const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'qantas',
    transform: transform,
    domain: 'store.qantas.com',
    zipcode: '',
  },
};
