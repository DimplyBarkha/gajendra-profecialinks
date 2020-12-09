const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'iceland',
    transform: transform,
    domain: 'iceland.co.uk',
    zipcode: '',
  },
};
