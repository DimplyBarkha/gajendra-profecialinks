const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PE',
    store: 'ripley',
    transform,
    domain: 'simple.ripley.com.pe',
    zipcode: '',
  },
};
