
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    domain: 'onlinetrade.ru',
    url: 'https://www.onlinetrade.ru/sitesearch.html?query={searchTerms}',
    loadedSelector: 'div.indexGoods__item',
    noResultsXPath: '//div[contains(@class,"content")]//h1[contains(text(),"Найденные категории")] | //div[contains(@class,"content")]//p[contains(text(),"Ничего не найдено")]',
    zipcode: '',
  },
};
