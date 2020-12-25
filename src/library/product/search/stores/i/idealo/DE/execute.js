module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'idealo',
    domain: 'idealo.de',
    url: 'https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"no-result-SuggestionText")]',
    zipcode: '',
  },
};
