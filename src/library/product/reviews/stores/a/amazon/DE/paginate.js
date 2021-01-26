module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    // nextLinkSelector: 'li.a-last > a',
    // spinnerSelector: 'div.reviews-loading:not(.aok-hidden)',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | /html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Suchen Sie bestimmte Informationen")]',
    // Use openSearchDefinition if nextLink has navigation issues.
    openSearchDefinition: {
      template: 'https://www.amazon.de/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.de',
  },
};
