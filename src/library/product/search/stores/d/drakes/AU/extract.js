
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'drakes',
    transform,
    domain: 'drakes.com.au',
    zipcode: '',
  },
};
