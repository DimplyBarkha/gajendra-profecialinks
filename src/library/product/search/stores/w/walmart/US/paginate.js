
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-type="items"],span[data-automation-id="zero-results-message"]',
    openSearchDefinition: {
      template: 'https://www.walmart.com/search/search-ng.do?grid=true&page={page}&ps=48&search_query={searchTerms}',
    },
    domain: 'walmart.com',
  },
};
