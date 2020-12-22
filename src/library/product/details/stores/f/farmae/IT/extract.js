const { transform } = require('./transform.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'farmae',
    transform: transform,
    domain: 'farmae.it',
    zipcode: '',
  },
};
