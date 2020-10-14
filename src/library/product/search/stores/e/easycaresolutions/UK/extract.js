const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'easycaresolutions',
    transform,
    domain: 'easycaresolutions.co.uk',
    zipcode: '',
  },
};
