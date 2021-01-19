
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'CA',
    domain: 'amazon.ca',
    store: 'amazon',
    loadedSelector: 'input[id*="add-to-cart-button"]:not([style*="not-allowed"])',
    noResultsXPath: '//*[@id="fresh-primeFresh-cancel-string"] | //*[@id="add-to-cart-button" and contains(@style, "not-allowed")] | //*[@id="outOfStock"] | //*[@id="buybox-see-all-buying-choices-announce"]',
    sellerInventoryUrl: 'https://www.amazon.ca/dp/{id}?smid={sellerId}&th=1&psc=1',
    zipcode: '',
  },
};
