const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'saksfifthavenue',
    transform: cleanUp,
    domain: 'saksfifthavenue.com',
    zipcode: '',
  },
};
