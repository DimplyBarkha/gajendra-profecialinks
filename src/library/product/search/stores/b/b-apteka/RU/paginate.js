
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'b-apteka',
    nextLinkSelector: 'button[class*="button_default pagination__button"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.j-results-list',
    noResultsXPath: '//h1[contains(text(),"Результатов не найдено")]',
    openSearchDefinition: null,
    domain: 'b-apteka.ru',
    zipcode: "''",
  },
};
