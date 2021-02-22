
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'amazonFresh',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[data-hook="review"]',
    loadedXpath: null,
    noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | /html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.amazon.co.uk/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.co.uk',
    zipcode: 'NW1 8AA',
  },
};
