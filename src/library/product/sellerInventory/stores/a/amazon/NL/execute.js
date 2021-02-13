
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'NL',
    domain: 'amazon.nl',
    store: 'amazon',
    loadedSelector: 'input[id*="add-to-cart-button"]:not([style*="not-allowed"])',
    noResultsXPath: '//*[@id="fresh-primeFresh-cancel-string"] | //*[@id="add-to-cart-button" and contains(@style, "not-allowed")] | //*[@id="outOfStock"] | //*[@id="buybox-see-all-buying-choices-announce"] | //div[contains(@id,"desktop_qualifiedBuyBox")][not(//div[@id="addToCart_feature_div"]//*)]//*[@id="submit.buy-now-announce"]',
    sellerInventoryUrl: 'https://www.amazon.nl/dp/{id}?smid={sellerId}&th=1&psc=1',
    zipcode: '',
  },
};
