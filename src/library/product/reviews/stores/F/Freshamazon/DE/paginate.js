
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'Freshamazon',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[data-hook="review"]',
    loadedXpath: null,
    noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | /html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Suchen Sie bestimmte Informationen")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    dateSelector:'span[data-hook="review-date"]',
    openSearchDefinition: {
      template: 'https://www.amazon.de/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.de',
    zipcode: '10243',
  },
};
