const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'joycemayne',
    transform,
    domain: 'joycemayne.com.au',
    zipcode: '',
  },
};
