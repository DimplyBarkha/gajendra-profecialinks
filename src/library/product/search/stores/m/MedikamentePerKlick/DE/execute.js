
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'MedikamentePerKlick',
    domain: 'medikamenteperklick.de',
    url: 'https://www.medikamente-per-klick.de/keywordsearch?sortBy=default&VIEW_SIZE=20&VIEW_INDEX=0&clearSearch=N&SEARCH_STRING={searchTerms}',
    loadedSelector: 'div.productsList',
    noResultsXPath: '//div[@id="searchList" and contains(text()[5],"Keine Ergebnisse gefunden")]',
    zipcode: '',
  },
};
