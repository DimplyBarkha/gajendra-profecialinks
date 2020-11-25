const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'wbmason',
    transform,
    domain: 'wbmason.com',
    zipcode: '',
  },
};
