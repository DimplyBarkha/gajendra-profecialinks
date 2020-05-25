
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    url: {
      indexOffset: 0,
      template: 'https://www.target.com/s?searchTerm={searchTerms}&Nao={startIndex}',
    },
    loadedXPath: '//div[@data-test="productGridContainer"]//li',
    domain: 'target.com',
  },
};
