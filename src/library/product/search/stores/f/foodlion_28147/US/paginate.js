
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'foodlion_28147',
    nextLinkSelector: 'li[class*="pagination-next"] button[aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: 'div[class*="load-app view-loading-indicator"]',
    loadedSelector: 'ol[class*=cell-container] div[class*="cell-image-wrapper"]',
    noResultsXPath: '//div[contains(text(),"No results found for")]',
    openSearchDefinition: {
      template: 'https://shop.foodlion.com/search?search_term={searchTerms}&page={page}',
    },
    domain: 'foodlion.com',
    zipcode: '28147',
  },
};
