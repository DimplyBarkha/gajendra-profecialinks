
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    domain: 'mvideo.ru',
    url: 'https://www.mvideo.ru/product-list-page-cls?q={searchTerms}&region_id=1&params=0&limit=12&offset=0',
    loadedSelector: 'div#js-product-tile-list',
    noResultsXPath: '//div[@class="search-no-results__description"]',
    zipcode: '',
  },
};
