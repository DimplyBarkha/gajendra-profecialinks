module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    domain: 'fust.ch',
    url: 'https://www.fust.ch/de/search.html?searchtext={searchTerms}',
    loadedSelector: 'div[id="productlisting"]',
    noResultsXPath: '//div[@class="row"]//p[text()="Es konnte für Ihre Suche leider keine passenden Ergebnisse gefunden werden."]|//*[@id="mainContent"]/div[4]/div[count(*)=0]',
    zipcode: '',
  },
};
