
const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'gpsfarma',
    transform,
    domain: 'gpsfarma.com',
    zipcode: '',
  },
};
