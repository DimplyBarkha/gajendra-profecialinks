
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'ochkarik',
    domain: 'ochkarik.ru',
    url: 'https://ochkarik.ru/search/?mode={searchterm}',
    loadedSelector: 'div[class="productsContainer search-container"] div[class="product-grid__wrap "]',
    noResultsXPath: null,
    zipcode: '',
  },
};
