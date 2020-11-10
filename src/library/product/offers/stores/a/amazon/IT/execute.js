
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    domain: 'amazon.it',
    loadedSelector: '[class="a-row a-spacing-mini olpOffer"]',
    noResultsXPath: '//div[@id="olpOfferList"]/div/p | /html[not(//script[contains(text(),\'pageType: "OfferListing"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //img[contains(@alt,"Dogs of Amazon")]',
    offerUrl: 'https://www.amazon.it/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10',
    zipcode: '',
  },
};
