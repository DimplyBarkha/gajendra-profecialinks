const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'calphalon',
    transform,
    domain: 'calphalon.com',
    zipcode: '',
  },
};
