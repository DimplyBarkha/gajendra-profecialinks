
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'amazon',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    // nextLinkXpath: '//div[@data-hook="pagination-bar"]//ul//li[@class="a-last" and not(contains(@class, "a-disabled"))]',
    // mutationSelector: 'div#cm_cr-review_list',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXpath: null,
    // noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | /html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: "div[data-hook='review']",
    openSearchDefinition: {
      regexStr: '(?<=dp\/)(.+)(?=\/)',
      template: 'https://www.amazon.de/product-reviews/{id}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews&pageNumber={page}',
    },
    domain: 'amazon.de',
    zipcode: "''",
  },
};
