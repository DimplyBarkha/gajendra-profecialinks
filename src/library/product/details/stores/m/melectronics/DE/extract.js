const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  },
};
