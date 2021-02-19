module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'AE',
    store: 'amazon',
    domain: 'amazon.ae',
    loadedSelector: '[data-hook="review"]',
    // noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,  "Sorry")] ',
    noResultsXPath: null,
    reviewUrl: 'https://www.amazon.ae/product-reviews/{id}/?sortBy=recent',
  },
};
