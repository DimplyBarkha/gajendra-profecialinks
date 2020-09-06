
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    domain: 'onlinetrade.ru',
    url: 'https://www.onlinetrade.ru/sitesearch.html?query={searchTerms}',
    loadedSelector: 'div.indexGoods__item',
    noResultsXPath: null,
    zipcode: '',
  },
};
