const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GR',
    store: 'ab',
    transform: transform,
    zipcode: '',
    domain: 'ab.gr',
  },
};
