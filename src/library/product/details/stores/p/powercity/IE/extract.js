const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'powercity',
    transform,
    domain: 'powercity.ie',
    zipcode: '',
  },
};
