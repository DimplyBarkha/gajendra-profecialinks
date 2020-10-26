
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    domain: 'eldorado.ru',
    url: 'https://www.eldorado.ru/search/catalog.php?q=dyson',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
