const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'wbmason',
    transform,
    domain: 'wbmason.com',
    zipcode: '',
  },
};
