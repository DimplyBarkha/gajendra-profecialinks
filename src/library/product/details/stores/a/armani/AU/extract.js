const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'armani',
    transform,
    domain: 'armani.com',
    zipcode: '',
  },
};
