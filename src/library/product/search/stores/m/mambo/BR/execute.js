module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'mambo',
    domain: 'mambo.com.br',
    url:
      'https://api.linximpulse.com/engage/search/v3/search?origin=https://www.mambo.com.br&apiKey=mambo-v7&showOnlyAvailable=true&resultsPerPage=150&productFormat=complete&terms={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@id="emptySearch"]',
    zipcode: '',
  },
};
