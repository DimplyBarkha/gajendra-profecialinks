
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'makro',
    domain: 'makro.pl',
    url: 'https://online.makro.pl/shop/search?q={searchTerms}',
    loadedXpath: '//h1//span[text() = "Wyniki wyszukiwania"]',
    noResultsXPath: '//h3/span[text()="Brak wyników!"]',
    zipcode: '',
  },
};
