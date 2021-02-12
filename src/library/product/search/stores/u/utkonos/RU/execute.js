
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'utkonos',
    domain: 'utkonos.ru',
    url: 'https://www.utkonos.ru/search/{searchTerms}/page/1',
    loadedSelector: '.catalog-grid',
    noResultsXPath: '//h1[contains(text(), "По запросу")]',
    zipcode: "''",
  },
};
