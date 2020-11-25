
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    domain: 'pokupki.market.yandex.ru',
    url: 'https://pokupki.market.yandex.ru/search?text={searchTerms}',
    loadedSelector: 'div.b_2wGkXdFPAH',
    noResultsXPath: '//div[@class="b_y8i0GBUY25"]//div[contains(@class,"b_2lf8berAKx")]',
    zipcode: '',
  },
};
