const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform: cleanUp,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
