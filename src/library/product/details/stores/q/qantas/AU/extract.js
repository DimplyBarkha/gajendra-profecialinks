const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'qantas',
    transform: transform,
    domain: 'store.qantas.com',
    zipcode: '',
  },
};
