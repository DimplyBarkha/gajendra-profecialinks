
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'AU',
    store: 'amazon',
    domain: 'amazon.com.au',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,  "Sorry")] ',
    reviewUrl: 'https://www.amazon.com.au/product-reviews/{id}/?sortBy=recent',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
