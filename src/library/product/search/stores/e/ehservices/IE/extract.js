const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'ehservices',
    transform,
    domain: 'ehservices.co.uk',
    zipcode: '',
  },
};
