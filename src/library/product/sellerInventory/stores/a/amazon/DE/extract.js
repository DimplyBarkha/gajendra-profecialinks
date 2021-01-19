const { transform } = require('../../../../shared');
const { getStockFunc } = require('../sharedExtract');

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    getStockFunc,
    domain: 'amazon.de',
    loadedSelector: '#add-to-cart-button:not([style*="not-allowed"])',
    zipcode: '',
  },
};
