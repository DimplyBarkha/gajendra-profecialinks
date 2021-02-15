
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    domain: 'ozon.ru',
    url: 'https://www.ozon.ru/search/?from_global=false&text={searchTerms}',
    loadedSelector: 'div.container',
    noResultsXPath: '//div[@class="b6q3"]',
    zipcode: '',
  },
};
