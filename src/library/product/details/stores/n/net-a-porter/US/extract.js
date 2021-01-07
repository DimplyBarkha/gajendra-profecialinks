const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'net-a-porter',
    transform,
    zipcode: '',
    domain: 'net-a-porter.com',
  },
};
