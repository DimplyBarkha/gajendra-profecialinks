
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'filshill',
    transform: transform,
    domain: 'filshill.co.uk',
    zipcode: '',
  },
};
