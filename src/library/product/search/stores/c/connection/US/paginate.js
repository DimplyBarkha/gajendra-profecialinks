module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'connection',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition:  {
      template: 'https://www.connection.com/product/searchpage?SearchType=1&term={searchTerms}&pageNumber={page}&pageSize=48&url=https://www.connection.com/IPA/Shop/Product/Search&mode=List',
    },
    domain: 'connection.com',
  },
};
