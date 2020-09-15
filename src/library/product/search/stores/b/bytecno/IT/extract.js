const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'bytecno',
    transform: transform,
    domain: 'bytecno.it',
    zipcode: '',
  },
};
