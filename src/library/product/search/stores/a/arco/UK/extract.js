const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    transform,
    domain: 'arco.uk',
    zipcode: '',
  },
};
