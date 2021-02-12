
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'b-apteka',
    nextLinkSelector: null, //'button.j-more-button', //[class*="button button_block button_xl button_default pagination__button j-more-button "]',
    // nextLinkSelector: 'div.pagination__arrow:not(:first-of-type)>a',
    spinnerSelector: null,
    loadedSelector: 'div.j-results-list div.search-card',
    noResultsXPath: '//h1[contains(text(),"Результатов не найдено")]',
    openSearchDefinition: null,
    domain: 'b-apteka.ru',
    zipcode: "''",
  },
};
