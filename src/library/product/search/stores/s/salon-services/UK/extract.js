const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'salon-services',
    transform, 
    domain: 'salon-services.com',
    zipcode: '',
  },
};
