const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'telus',
    transform,
    domain: 'telus.com',
    zipcode: '',
  },
};
