const { transform } = require('../shared');
const { implementation } = require('../US/extract');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bedBathBeyond',
    transform,
    domain: 'bedbathandbeyond.ca',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    helperModule: 'module:helpers/helpers',
  },
  implementation,
};
