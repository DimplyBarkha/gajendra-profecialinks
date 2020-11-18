
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'santehnika-online',
    domain: 'santehnika-online.ru',
    url: 'https://santehnika-online.ru/search/?strategy=vectors_strict,zero_queries&q={searchTerms}',
    loadedSelector: 'div[class*=\'products__list-item\']',
    noResultsXPath: '//div[@class="p-search-b-search-result"]',
    zipcode: '',
  },
};
