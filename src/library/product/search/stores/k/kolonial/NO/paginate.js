
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'kolonial',
    nextLinkSelector: null,//'#content > div > div > div > div.row.ws-xs > div.col-xs-12.col-sm-9.main-search-content.animated.fadeIn > ul > li:nth-child(7) > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition:
    {
      template:'https://kolonial.no/sok/?page={page}&q={searchTerms}'
    },
    domain: 'kolonial.no',
    zipcode: '',
  },
};
