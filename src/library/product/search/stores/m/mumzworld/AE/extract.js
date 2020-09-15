const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'mumzworld',
    transform,
    domain: 'mumzworld.com',
    zipcode: '',
  },
};
