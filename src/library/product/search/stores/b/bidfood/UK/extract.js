const {transform} = require('../../../../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'bidfood',
    transform,
    domain: 'bidfood.co.uk',
    zipcode: '',
  },
};
