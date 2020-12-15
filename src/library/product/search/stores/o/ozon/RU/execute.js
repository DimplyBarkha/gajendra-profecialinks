
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    domain: 'ozon.ru',
    url: 'https://www.ozon.ru/search/?from_global=true&text={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
