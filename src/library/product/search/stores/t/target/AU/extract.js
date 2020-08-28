
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'target',
    transform,
    domain: 'target.com.au',
    zipcode: '',
  },
};
