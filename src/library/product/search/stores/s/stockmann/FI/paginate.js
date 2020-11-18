
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    nextLinkSelector: 'div.show-more-wrapper button',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'div.product-grid div.product',
    loadedXpath: null,
    noResultsXPath: '//h1[@class="header page-title" and contains(text(),"Pahoittelemme, haullasi ei löytynyt tuloksia")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'stockmann.com',
    zipcode: "''",
  },
};
