const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'cobasi',
    transform,
    domain: 'cobasi.com',
    zipcode: '',
  },
};
