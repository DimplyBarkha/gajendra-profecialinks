const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    transform,
    domain: 'procie.fr',
    zipcode: '',
  },
};
