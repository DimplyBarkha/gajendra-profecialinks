
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    domain: 'onlinetrade.ru',
    loadedSelector: '.indexGoods__item',
    noResultsXPath: '//div[contains(@class,"content__mainColumn")]/p[contains(text(),"Ничего не найдено")]',
    zipcode: '',
  },
};
