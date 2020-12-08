const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    transform,
    domain: 'loblaws.ca',
    zipcode: '',
  },
};
