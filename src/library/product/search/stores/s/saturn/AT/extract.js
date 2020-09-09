const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'saturn',
    transform,
    domain: 'saturn.at',
    zipcode: '',
  },
};
