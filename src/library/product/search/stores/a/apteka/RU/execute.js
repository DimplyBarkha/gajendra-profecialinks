
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'apteka',
    domain: 'apteka.ru',
    url: 'https://apteka.ru/search/?q={searchTerms}&page=1',
    loadedSelector: '.CatalogItemsList__grid, .ViewProductPage__bannersComponent, div[class*="cards-list"] div[class*="catalog-card"]',
    noResultsXPath: '//p[contains(text(), "Увы, ничего")] | //*[contains(@class,"SearchResultTitle__not-found")][contains(text(),"По запросу")] |//div[contains(@class,"catalog-empty-response")]',
    zipcode: '',
  },
};
