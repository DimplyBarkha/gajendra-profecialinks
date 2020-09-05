const {transform} = require('../transform')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'mumzworld',
    transform,
    domain: 'mumzworld.com',
    zipcode: '',
  },
};
