const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'EE',
    store: 'selver',
    transform: transform,
    domain: 'selver.ee',
    zipcode: '',
  },
};
