
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'b-apteka',
    // nextLinkSelector: 'button[class*="button_default pagination__button"]',
    nextLinkSelector: 'div.pagination__arrow:not(:first-of-type)>a',
    spinnerSelector: null,
    loadedSelector: 'div.j-results-list',
    noResultsXPath: '//h1[contains(text(),"Результатов не найдено")]',
    openSearchDefinition: null,
    domain: 'b-apteka.ru',
    zipcode: "''",
  },
};
