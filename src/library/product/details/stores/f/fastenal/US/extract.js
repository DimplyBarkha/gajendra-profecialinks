const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'fastenal',
    transform: transform,
    domain: 'fastenal.com',
    zipcode: '',
  },
};
