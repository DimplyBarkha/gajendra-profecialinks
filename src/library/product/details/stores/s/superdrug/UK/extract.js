const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform,
    domain: 'superdrug.com',
  },
};
