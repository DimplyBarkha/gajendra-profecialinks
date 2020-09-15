
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    domain: 'mvideo.ru',
    url: 'https://www.mvideo.ru/product-list-page?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="search-no-results__description"]',
    zipcode: '',
  },
};
