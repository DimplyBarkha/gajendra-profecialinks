const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'manor',
    transform,
    domain: 'manor.ch',
    zipcode: '',
  },
};
