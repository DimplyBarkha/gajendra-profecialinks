
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    domain: 'ebay.es',
    url: 'http://www.ebaystores.es/Dyson-Oficial?_nkw={searchTerms}&',
    loadedSelector: 'td#CentralArea',
    noResultsXPath: '//div[contains(@class,"trc")]//span[text()=0]',
    zipcode: '',
  },
};
