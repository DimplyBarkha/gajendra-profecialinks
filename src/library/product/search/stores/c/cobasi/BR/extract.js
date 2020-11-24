const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'cobasi',
    transform,
    domain: 'cobasi.com',
    zipcode: '',
  },
};
