const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'matthewclarklive',
    transform: transform,
    domain: 'matthewclarklive.com',
    zipcode: '',
  },
};
