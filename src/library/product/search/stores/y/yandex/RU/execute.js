
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'yandex',
    domain: 'yandex.ru',
    url: 'https://market.yandex.ru/search?text={searchTerms}&cvredirect=2&cpa=0&onstock=0&local-offers-first=0',
    loadedSelector: 'article._1_IxNTwqll',
    noResultsXPath: '//div[@class="_2QX_1Ho2Fe"]',
    zipcode: '',
  },
};