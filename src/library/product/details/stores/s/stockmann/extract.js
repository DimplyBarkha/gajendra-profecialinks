const{transform} = require('./shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: '',
    store: 'stockmann',
    transform: transform,
    domain: 'stockmann.com',
    zipcode: '',
  },
};
