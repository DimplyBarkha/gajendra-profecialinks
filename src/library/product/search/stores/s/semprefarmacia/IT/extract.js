const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'semprefarmacia',
    transform,
    domain: 'semprefarmacia.it',
    zipcode: '',
  },
};
