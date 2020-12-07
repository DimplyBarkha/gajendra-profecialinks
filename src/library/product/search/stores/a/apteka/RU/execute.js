
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'apteka',
    domain: 'apteka.ru',
    url: 'https://apteka.ru/search/?q={searchTerms}&page=1',
    loadedSelector: '.CatalogItemsList__grid',
    noResultsXPath: '//p[contains(text(), "Увы, ничего")]',
    zipcode: '',
  },
};
