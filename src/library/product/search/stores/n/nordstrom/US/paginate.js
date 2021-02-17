
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'nordstrom',
    nextLinkSelector: '#noPaginationForSteveMadden',
    // nextLinkSelector: 'span._3xquK',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section article',
    loadedXpath: null,
    noResultsXPath: '//h1[contains(text(),"No results for")] | //span[contains(text(),"Check the spelling or try a more general term.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'nordstrom.com',
    zipcode: '',
  },
};
