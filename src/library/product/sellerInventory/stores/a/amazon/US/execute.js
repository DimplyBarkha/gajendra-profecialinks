
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazon',
    loadedSelector: '#add-to-cart-button:not([style*="not-allowed"])',
    noResultsXPath: '//*[@id="add-to-cart-button" and contains(@style, "not-allowed")] | //*[@id="outOfStock"]',
    sellerInventoryUrl: 'https://www.amazon.com/dp/{id}?smid={sellerId}&th=1&psc=1',
    zipcode: '',
  },
};
