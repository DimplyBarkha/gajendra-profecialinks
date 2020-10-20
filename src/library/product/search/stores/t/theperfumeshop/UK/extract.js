const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'theperfumeshop',
    transform,
    domain: 'theperfumeshop.com',
    zipcode: '',
  },
};
