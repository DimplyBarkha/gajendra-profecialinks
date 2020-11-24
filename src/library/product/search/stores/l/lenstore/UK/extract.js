const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'lenstore',
    transform: transform,
    domain: 'lenstore.co.uk',
    zipcode: '',
  },
};
