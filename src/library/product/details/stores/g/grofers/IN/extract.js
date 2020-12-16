const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'grofers',
    transform,
    domain: 'grofers.com',
    zipcode: '',
  },
};
