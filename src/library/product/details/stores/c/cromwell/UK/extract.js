const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    transform: transform,
    domain: 'cromwell.co.uk',
    zipcode: '',
  },
};
