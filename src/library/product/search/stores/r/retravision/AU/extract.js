const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'retravision',
    transform,
    domain: 'retravision.com.au',
    zipcode: '',
  },
};
