const { transform } = require('../tranform');
 module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: '',
  },
};
