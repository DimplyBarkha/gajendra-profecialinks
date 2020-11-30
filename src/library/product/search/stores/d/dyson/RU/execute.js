
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'dyson',
    domain: 'dyson.ru',
    url: 'https://shop.dyson.ru/search/?q={searchTerms}',
    noResultsXPath: '//h2[contains(.,"По вашему запросу товаров не найдено")]',
    zipcode: '',
  },
};
