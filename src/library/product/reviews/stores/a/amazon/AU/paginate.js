
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AU',
    store: 'amazon',
    nextLinkSelector: null,
    // nextLinkSelector: 'li.a-last > a',
    nextPageUrlSelector: null,
    nextLinkXpath: 'null',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | /html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,  "Sorry")]',
    // noResultsXPath: null,
    loadedXpath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: null,
    openSearchDefinition: {
      template: 'https://www.amazon.com.au/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.com.au',
    zipcode: '',
  },
};
