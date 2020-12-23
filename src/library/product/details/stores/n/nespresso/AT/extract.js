const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'nespresso',
    transform: transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
