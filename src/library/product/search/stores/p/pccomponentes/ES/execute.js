module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'pccomponentes',
    domain: 'pccomponentes.com',
    url: 'https://www.pccomponentes.com/buscar/?query={searchTerms}',
    loadedSelector: 'div.main',
    noResultsXPath: "//div[@id='articleListContent']//p",
  },
};
