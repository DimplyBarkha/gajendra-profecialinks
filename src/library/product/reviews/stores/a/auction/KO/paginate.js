
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'KO',
    store: 'auction',
    nextLinkSelector: 'div.box__pagination a.link__page-move.link__page-next',
    nextPageUrlSelector: null,
    nextLinkXpath: null,
    mutationSelector: 'div#divVipReview ul.list__review',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'auction.co.kr',
    zipcode: '',
  },
};
