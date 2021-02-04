module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'aptekagemini',
    domain: 'aptekagemini.pl',
    url: 'https://www.aptekagemini.pl/znajdz?query={searchTerms}',
    loadedXPath: '//ol[contains(@class,"ais-Hits-list")]//li[contains(@class,"ais-Hits-item")]//div[@class = "product-card__container"]',
    noResultsXPath: '//h2[contains(.,"Niestety")]',
    zipcode: '',
  },

};
