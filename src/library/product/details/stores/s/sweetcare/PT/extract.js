const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'sweetcare',
    transform,
    domain: 'sweetcare.pt',
    zipcode: '',
  },
};
