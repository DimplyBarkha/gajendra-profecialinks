module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    nextLinkSelector: 'li.a-last > a',
    spinnerSelector: 'div.reviews-loading:not(.aok-hidden)',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")]',
    // Use openSearchDefinition if nextLink has navigation issues.
    openSearchDefinition: {
      template: 'https://www.amazon.co.uk/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.co.uk',
  },
};
