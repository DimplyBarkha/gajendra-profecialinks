const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'farmacity',
    transform,
    domain: 'farmacity.com',
    zipcode: '',
  },
};
