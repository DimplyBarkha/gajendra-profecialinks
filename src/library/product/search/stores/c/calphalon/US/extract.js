const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'calphalon',
    transform,
    domain: 'calphalon.com',
    zipcode: '',
  },
};
