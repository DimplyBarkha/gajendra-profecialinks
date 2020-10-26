const {transform} = require('../format.js')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'rei',
    transform,
    domain: 'rei.com',
    zipcode: '',
  },
};
