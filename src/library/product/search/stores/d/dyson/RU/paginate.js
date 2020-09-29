
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'dyson',
    noResultsXPath: '//h2[contains(.,"По вашему запросу товаров не найдено)]',
    domain: 'dyson.ru',
    zipcode: '',
  },
};
