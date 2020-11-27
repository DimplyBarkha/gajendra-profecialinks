
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    nextLinkSelector: 'body > div.wrapper.off-canvas-wrap > div.inner-wrap.row-collapse > div > div.content > div > div > div.toolbar.row > div > div > div:nth-child(3) > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.flaconi.de/search/?q={searchTerms}&page={page}',
    //   },
    domain: 'flaconi.de',
    zipcode: '',
  },
};
