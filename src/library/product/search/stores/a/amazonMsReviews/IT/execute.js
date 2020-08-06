
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsReviews',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook="review"]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "404")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Cerchi qualcosa in particolare")] | //a[contains(@href,"ref=cs_503_link")]',
    zipcode: '',
  },
};
