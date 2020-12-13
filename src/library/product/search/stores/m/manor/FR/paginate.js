
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'manor',
    nextLinkSelector: 'div.m-page-selection-pagination li.pagination-next.js-next:not(.disabled)',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'a.m-backtotop.js-back-to-top[style="display: block;"]',
    loadedSelector: 'div#epoq_resultrows div.epoq_resultrow',
    loadedXpath: null,
    noResultsXPath: '//p[contains(text(),"Nous n’avons malheureusement trouvé aucun résultat. L’article que vous recherchez n’est peut-être pas disponible en ligne actuellement")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'manor.ch',
    zipcode: "''",
  },
};
