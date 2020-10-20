const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'sharafdg',
    transform,
    domain: 'sharafdg.com',
    zipcode: '',
  },
};
