const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    transform,
    domain: 'holmesproducts.com',
    zipcode: '',
  },
};
