module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    domain: 'eldorado.ru',
    url: 'https://www.eldorado.ru/search/catalog.php?q={searchTerms}',
    loadedSelector: "ul[data-dy^='productsList']",
    noResultsXPath: "//div[@class='digi-not-found']",
  },
};
