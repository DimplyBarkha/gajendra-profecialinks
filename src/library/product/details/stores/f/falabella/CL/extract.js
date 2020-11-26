const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CL',
    store: 'falabella',
    transform,
    domain: 'falabella.com',
    zipcode: '',
  },
};
