
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    domain: 'breuninger.de',
    url: 'https://www.breuninger.com/de/suche/?q={searchTerms}',
    loadedSelector: '*[data-order]',
    noResultsXPath: '//div[@class="suchen-page-headline"]//div[contains(text(), "Es wurden keine Treffer")]',
    zipcode: '',
  },
};
