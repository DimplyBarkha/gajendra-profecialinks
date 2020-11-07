const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    transform,
    domain: 'alloffice.se',
    zipcode: '',
  },
};
