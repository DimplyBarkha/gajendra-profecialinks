const {transform} = require('../format.js')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'wine',
    transform,
    domain: 'wine.com',
    zipcode: '',
  },
};
