const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'whiskyzone',
    transform,
    domain: 'whiskyzone.de',
    zipcode: '',
  },
};
