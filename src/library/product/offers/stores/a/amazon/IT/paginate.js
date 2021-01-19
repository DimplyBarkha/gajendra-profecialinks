module.exports = {
  implements: 'product/offers/paginate',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    nextLinkSelector: 'li.a-last > a',
    spinnerSelector: null,
    loadedSelector: '[class="a-row a-spacing-mini olpOffer"]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,  "Sorry")]',
    // Use openSearchDefinition if nextLink has navigation issues.
    openSearchDefinition: {
      indexOffset: 10,
      template: 'https://www.amazon.it/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10&&startIndex={offset}',
    },
    domain: 'amazon.it',
  },
};
