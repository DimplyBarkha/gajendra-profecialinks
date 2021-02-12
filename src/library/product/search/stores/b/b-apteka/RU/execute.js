
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'b-apteka',
    domain: 'b-apteka.ru',
    url: 'https://b-apteka.ru/search?q={searchTerms}',
    loadedSelector: 'div.j-results-list div.search-card',
    noResultsXPath: '//h1[contains(text(),"Результатов не найдено")]',
    zipcode: "''",
  },
};
