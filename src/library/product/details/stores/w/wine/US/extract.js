const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'wine',
    transform,
    domain: 'wine.com',
    zipcode: '',
  },
};
