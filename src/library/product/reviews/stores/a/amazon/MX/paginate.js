
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'MX',
    store: 'amazon',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | /html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")]',
    openSearchDefinition: {
      template: 'https://www.amazon.com.mx/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.com.mx',
  },
};
