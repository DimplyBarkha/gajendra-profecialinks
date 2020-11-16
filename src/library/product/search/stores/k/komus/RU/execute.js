
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    domain: 'komus.ru',
    url: "https://www.komus.ru/search?text={searchTerms}",
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
