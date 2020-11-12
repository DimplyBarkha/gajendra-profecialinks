
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    openSearchDefinition: {
      indexOffset: 0,
      template: 'https://www.target.com/s?searchTerm={searchTerms}&Nao={startIndex}',
    },
    loadedSelector: 'div[data-test="productGridContainer"] li',
    domain: 'target.com',
  },
};
