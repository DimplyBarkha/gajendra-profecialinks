const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto-office',
    transform: transform,
    domain: 'otto-office.com',
    zipcode: '',
  },
};
