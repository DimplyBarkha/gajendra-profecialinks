const {transform} = require('../UK/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'bidfood',
    transform,
    domain: 'bidfood.co.uk',
    zipcode: '',
  },
};
