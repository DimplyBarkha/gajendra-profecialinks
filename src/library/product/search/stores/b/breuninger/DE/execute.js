
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    domain: 'breuninger.de',
    url: 'https://www.breuninger.com/de/suche/?q={searchTerms}',
    loadedSelector: '*[data-order]',
    noResultsXPath: '//h1[contains(@class,"suchen-null-treffer-headline")]//span/following-sibling::text()["leider nichts finden"]',
    zipcode: '',
  },
};
