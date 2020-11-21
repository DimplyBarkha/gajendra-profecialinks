const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    transform: transform,
    domain: 'mecca.com.au',
    zipcode: '',
  },
};
