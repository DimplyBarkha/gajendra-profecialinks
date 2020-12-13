
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'manor',
    nextLinkSelector: 'div.m-page-selection-pagination li.pagination-next.js-next:not(.disabled)',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'a.m-backtotop.js-back-to-top[style="display: block;"]',
    loadedSelector: 'div#epoq_resultrows div.epoq_resultrow',
    loadedXpath: null,
    noResultsXPath: '//p[contains(text(),"Leider konnten wir kein Ergebnis für Sie finden. Falls Sie ein Produkt gesucht haben, kann es sein, dass dies derzeit online nicht verfügbar ist")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'manor.ch',
    zipcode: "''",
  },
};
