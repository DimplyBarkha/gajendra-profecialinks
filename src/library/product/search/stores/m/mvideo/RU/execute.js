
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    domain: 'mvideo.ru',
    url: 'https://www.mvideo.ru/product-list-page-cls?q=Стиральные машины',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
