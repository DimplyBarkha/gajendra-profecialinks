const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'totalwine_95825',
    domain: 'totalwine.com',
    transform,
    zipcode: '95825',
  },
};
