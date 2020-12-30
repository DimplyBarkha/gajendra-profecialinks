
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'DE',
    domain: 'amazon.de',
    store: 'amazon',
    loadedSelector: 'input[id*="add-to-cart-button"]:not([style*="not-allowed"])',
    noResultsXPath: '//*[@id="add-to-cart-button" and contains(@style, "not-allowed")] | //*[@id="outOfStock"] | //*[@id="buybox-see-all-buying-choices-announce"]',
    sellerInventoryUrl: 'https://www.amazon.de/dp/{id}?smid={sellerId}&th=1&psc=1',
    zipcode: '',
  },
};
