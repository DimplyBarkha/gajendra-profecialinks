const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'retravision',
    transform,
    domain: 'retravision.com.au',
    zipcode: '',
  },
};
