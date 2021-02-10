const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'countdown',
    transform,
    domain: 'countdown.co.nz',
    zipcode: "''",
  },
};
