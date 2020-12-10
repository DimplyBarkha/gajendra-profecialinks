
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'foodlion_28147',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol[class*=cell-container] div[class*="cell-image-wrapper"]',
    noResultsXPath: '//div[contains(text(),"No results found for")]',
    openSearchDefinition: {
      template: 'https://shop.foodlion.com/search?search_term={searchTerms}&page={page}',
    },
    domain: 'foodlion.com',
    zipcode: '28147',
  },
};
