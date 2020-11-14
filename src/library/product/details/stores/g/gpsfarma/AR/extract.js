const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'gpsfarma',
    transform,
    domain: 'gpsfarma.com',
    zipcode: '',
  },
};
