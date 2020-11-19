const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    transform,
    domain: 'mecca.com.au',
    zipcode: '',
  },
};
