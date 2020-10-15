const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'lunneys',
    transform: transform,
    domain: 'lunneys.uk',
    zipcode: '',
  },
};
