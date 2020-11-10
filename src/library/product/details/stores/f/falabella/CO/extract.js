const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'falabella',
    transform,
    domain: 'falabella.com.co',
    zipcode: '',
  },
};
