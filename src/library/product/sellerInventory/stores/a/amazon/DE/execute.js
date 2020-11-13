
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'DE',
    domain: 'amazon.de',
    store: 'amazon',
    loadedSelector: '[class="a-row a-spacing-mini olpOffer"]',
    // noResultsXPath: '//div[@id="olpOfferList"]/div/p | /html[not(//script[contains(text(),\'pageType:"OfferListing"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //img[contains(@alt,"Dogs of Amazon")]',
    sellerInventoryUrl: 'https://www.amazon.de/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10',
    zipcode: '',
  },
};