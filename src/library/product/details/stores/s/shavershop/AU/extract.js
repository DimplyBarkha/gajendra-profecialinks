const {transform} = require('./transform')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    transform: transform,
    domain: 'shavershop.com.au',
    zipcode: '',
  },
};
