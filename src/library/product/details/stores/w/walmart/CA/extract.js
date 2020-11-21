const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
};
