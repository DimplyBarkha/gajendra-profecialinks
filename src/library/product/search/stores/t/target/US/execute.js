
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'target',
    domain: 'target.com',
    url: 'https://www.target.com/s?searchTerm={searchTerms}',
    loadedSelector: 'div[data-test="productGridContainer"] li',
    noResultsXPath: '//h1[contains(.,"no results found")]',
    zipcode: '',
  },
};
