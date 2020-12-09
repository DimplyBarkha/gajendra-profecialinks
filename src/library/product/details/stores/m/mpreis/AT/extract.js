const { transform } = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    transform,
    domain: 'mpreis.at',
    zipcode: '',
  },
};
