const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform,
    domain: 'selfridges.com',
    zipcode: '',
  },
};
