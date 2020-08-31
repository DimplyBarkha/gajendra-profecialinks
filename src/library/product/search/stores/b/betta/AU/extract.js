const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    transform,
    domain: 'betta.com.au',
    zipcode: '',
  },
};
