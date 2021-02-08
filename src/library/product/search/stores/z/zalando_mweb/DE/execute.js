
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando_mweb',
    domain: 'zalando.de',
    url: 'https://m.zalando.de/herren/?q={searchTerms}',
    loadedSelector: 'script[id="z-nvg-cognac-props"]',
    noResultsXPath: '//span[contains(text(), "Versuche es mit einem anderen Suchbegriff oder prüfe die Schreibweise")]',
    zipcode: '',
  },
};
