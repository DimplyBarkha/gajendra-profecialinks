const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
};
