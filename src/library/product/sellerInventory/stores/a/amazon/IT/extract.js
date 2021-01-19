const { transform } = require('../../../../shared');
const { getStockFunc } = require('../sharedExtract');

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform,
    getStockFunc,
    domain: 'amazon.it',
    loadedSelector: '#add-to-cart-button:not([style*="not-allowed"])',
    zipcode: '',
  },
};
