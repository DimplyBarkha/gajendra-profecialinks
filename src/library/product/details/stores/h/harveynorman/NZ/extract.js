const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.co.nz',
    zipcode: '',
  },
};
