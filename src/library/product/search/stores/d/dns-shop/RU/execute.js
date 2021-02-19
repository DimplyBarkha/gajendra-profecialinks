
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    domain: 'dns-shop.ru',
    url: 'https://www.dns-shop.ru/search/?q={searchTerms}',
    loadedSelector: 'div.catalog-product img',
    noResultsXPath: "//h4[contains(@class, 'empty-search-results__container-header')]",
    zipcode: '',
  },
};
