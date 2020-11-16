
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'NL',
    domain: 'amazon.nl',
    store: 'amazon',
    loadedSelector: 'input[id*="add-to-cart-button"]:not([style*="not-allowed"])',
    noResultsXPath: '//*[@id="add-to-cart-button" and contains(@style, "not-allowed")] | //*[@id="outOfStock"]',
    sellerInventoryUrl: 'https://www.amazon.nl/dp/{id}?smid={sellerId}&th=1&psc=1',
    zipcode: '',
  },
};
