const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'heb',
    transform: null,
    domain: 'heb.com',
    zipcode: '',
  },
};
