const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'marmot',
    transform,
    domain: 'marmot.com',
    zipcode: '',
  },
};
