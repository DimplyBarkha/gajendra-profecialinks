
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'UK',
    domain: 'amazon.co.uk',
    store: 'amazon',
    loadedSelector: 'input[id*="add-to-cart-button"]:not([style*="not-allowed"])',
    noResultsXPath: '//*[@id="add-to-cart-button" and contains(@style, "not-allowed")] | //*[@id="outOfStock"] | //*[@id="buybox-see-all-buying-choices-announce"] | //*[@id="addToCart"]//input[@id="ASIN" and not(@value="{id}")]',
    sellerInventoryUrl: 'https://www.amazon.co.uk/dp/{id}?smid={sellerId}&th=1&psc=1',
    zipcode: '',
  },
};
