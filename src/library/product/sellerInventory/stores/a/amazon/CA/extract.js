const { transform } = require('../../../../shared');
const { getStockFunc } = require('../sharedExtract');

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    transform,
    getStockFunc,
    domain: 'amazon.ca',
    loadedSelector: '#add-to-cart-button:not([style*="not-allowed"])',
    zipcode: '',
  },
};
