const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'semprefarmacia',
    transform,
    domain: 'semprefarmacia.it',
    zipcode: '',
  },
};
