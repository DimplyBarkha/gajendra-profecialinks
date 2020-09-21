const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    transform: transform,
    zipcode: '',
    domain: 'aceuae.com',
  },
};
