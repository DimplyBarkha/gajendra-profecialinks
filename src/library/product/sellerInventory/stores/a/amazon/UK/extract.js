const { transform } = require('../../../../shared');
const { getStockFunc } = require('../sharedExtract');

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    getStockFunc,
    domain: 'amazon.co.uk',
    loadedSelector: '#add-to-cart-button:not([style*="not-allowed"])',
    zipcode: '',
  },
};
