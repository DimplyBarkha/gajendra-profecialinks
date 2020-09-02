const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    transform: transform,
    domain: 'expert.ie',
    zipcode: '',
  },
};
