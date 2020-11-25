const {transform} = require('../IT/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
};
