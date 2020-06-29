
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    openSearchDefinition: {
      indexOffset: 24,
      template: 'https://www.target.com/s?searchTerm={searchTerms}&Nao={startIndex}',
    },
    loadedSelector: 'ul li',
    noResultsXPath: '//h1[contains(.,"no results found")]',
    domain: 'target.com',
  },
};
