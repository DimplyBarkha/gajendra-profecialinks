const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'argos',
    transform,
    domain: 'argos.ie',
    zipcode: '',
  },
};
