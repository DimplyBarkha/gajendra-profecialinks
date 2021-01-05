
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'blu',
    domain: 'blu.com',
    url: 'https://www.blu.com/de/DE/deutschland/search?q={searchTerms}',
    loadedSelector: 'div.search-result__headerbox',
    noResultsXPath: '//li[@class="active"]//div[@class="search-result__headerbox"]//h3[contains(text(),"0 Ergebnisse")]',
    zipcode: '',
  },
};
