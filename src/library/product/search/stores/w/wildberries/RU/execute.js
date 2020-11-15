
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    domain: 'wildberries.ru',
    url: 'https://www.wildberries.ru/catalog/0/search.aspx?search={searchTerms}',
    loadedSelector: 'div[class="catalog_main_table j-products-container"]',
    noResultsXPath: '//p[contains(@class,"searching-results-text")][contains(.,"По Вашему")]',
    zipcode: '',
  },
};
