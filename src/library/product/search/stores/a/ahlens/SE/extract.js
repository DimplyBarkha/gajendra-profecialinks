const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform,
    domain: 'ahlens.se',
    zipcode: '',
  },
}
