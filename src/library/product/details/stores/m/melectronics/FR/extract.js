const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  },
};
