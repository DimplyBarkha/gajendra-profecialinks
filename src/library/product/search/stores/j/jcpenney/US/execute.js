module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    domain: 'jcpenney.com',
    url: 'https://www.jcpenney.com/s?searchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//h2[contains(text(),"Sorry, no products")]',
    zipcode: '',
  },
};