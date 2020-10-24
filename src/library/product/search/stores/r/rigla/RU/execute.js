
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'rigla',
    domain: 'rigla.ru',
    url: 'https://www.rigla.ru/search?q={searchTerms}',
    loadedSelector: 'div.catalog-content',
    noResultsXPath: '//div[@class="search-results__counts" and text()="(0)"]',
    zipcode: "''",
  },
};
