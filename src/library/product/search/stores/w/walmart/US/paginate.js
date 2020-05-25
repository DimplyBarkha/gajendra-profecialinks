
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-type="items"]',
    openSearchDefinition: {
      template: 'https://www.walmart.com/search/search-ng.do?page={page}&ps=48&search_query={searchTerms}',
    },
    domain: 'walmart.com',
  },
};
