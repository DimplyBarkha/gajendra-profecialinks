const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'theperfumeshop',
    transform,
    domain: 'theperfumeshop.com',
    zipcode: '',
  },
};
