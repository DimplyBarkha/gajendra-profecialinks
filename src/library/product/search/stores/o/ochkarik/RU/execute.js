
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'ochkarik',
    domain: 'ochkarik.ru',
    url: 'https://ochkarik.ru/search/?substring={searchTerms}',
    loadedSelector: 'div[class="productsContainer search-container"] div[class="product-grid__wrap "]',
    noResultsXPath: '//h2[@class="items-list-title"]',
    zipcode: '',
  },
};
