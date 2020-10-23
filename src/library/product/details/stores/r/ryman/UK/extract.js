const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ryman',
    transform,
    domain: 'ryman.co.uk',
    zipcode: '',
  },
};
