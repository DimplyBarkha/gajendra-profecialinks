const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'esselungaacasa',
    transform: transform,
    domain: 'esselungaacasa.it',
    zipcode: '',
  },
};
