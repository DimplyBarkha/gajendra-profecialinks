
const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'itvsn',
    transform,
    domain: 'itvsn.com.au',
  },
};
