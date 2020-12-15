
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    domain: 'mvideo.ru',
    url: 'https://www.mvideo.ru/product-list-page-cls?q=%D0%BC%D0%BE%D0%BD%D0%B8%D1%82%D0%BE%D1%80',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
