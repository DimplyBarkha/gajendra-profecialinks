
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'telekarma',
    domain: 'telekarma.pl',
    url: 'https://www.telekarma.pl/szukaj.htm?opt=0&find={searchTerms}',
    loadedSelector: 'div#content',
    noResultsXPath: '//div[contains(@class,"contentPadding")][contains(.,"Nie znaleziono.")]',
    zipcode: "''",
  },
};
