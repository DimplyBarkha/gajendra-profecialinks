module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    // nextLinkSelector: 'li.a-last > a',
    // spinnerSelector: 'div.reviews-loading:not(.aok-hidden)',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | //div[contains(@id,"review_list")  and not( //div[contains(@id,"customer_review")]) ]',
    // Use openSearchDefinition if nextLink has navigation issues.
    openSearchDefinition: {
      template: 'https://www.amazon.es/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.es',
  },
};
