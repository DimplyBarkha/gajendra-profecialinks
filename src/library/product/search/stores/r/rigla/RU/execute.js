
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'rigla',
    domain: 'rigla.ru',
    url: 'https://www.rigla.ru/search?limit=160&p=1&q={searchTerms}',
    loadedSelector: 'div.catalog-content div.product-list-mode-grid div.product', //'div.catalog-content',
    noResultsXPath: '//div[@class="search-results__counts" and text()="(0)"]',
    zipcode: "''",
  },
};
