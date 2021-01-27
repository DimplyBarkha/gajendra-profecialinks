
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    domain: 'mvideo.ru',
    url: 'https://www.mvideo.ru/product-list-page-cls?q={searchTerms}&region_id=1&limit=12&offset=0',
    // url: 'https://www.mvideo.ru/product-list-page-cls?q=стиральная машина',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
