
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    domain: 'eldorado.ru',
    url: 'https://www.eldorado.ru/search/catalog.php?q={searchTerms}',
    // url: 'https://www.eldorado.ru/search/catalog.php?q=dyson&utf',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
