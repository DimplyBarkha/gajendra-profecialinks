const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'powercity',
    transform,
    domain: 'powercity.ie',
    zipcode: '',
  },
};
