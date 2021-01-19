const { transform } = require('../../../../shared');
const { getStockFunc } = require('../sharedExtract');

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    getStockFunc,
    domain: 'amazon.fr',
    loadedSelector: '#add-to-cart-button:not([style*="not-allowed"])',
    zipcode: '',
  },
};