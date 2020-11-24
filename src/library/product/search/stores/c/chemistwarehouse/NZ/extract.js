const {transform} = require('../NZ/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'chemistwarehouse',
    transform,
    domain: 'chemistwarehouse.co.nz',
    zipcode: '',
  },
};
