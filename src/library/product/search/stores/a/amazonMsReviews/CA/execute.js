
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsReviews',
    domain: 'amazon.ca',
    url: 'https://www.amazon.ca/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,  "Sorry")] ',
    zipcode: '',
  },
};
