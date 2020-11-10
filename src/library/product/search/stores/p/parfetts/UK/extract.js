const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'parfetts',
    transform,
    domain: 'parfetts.co.uk',
    zipcode: '',
  },
};
