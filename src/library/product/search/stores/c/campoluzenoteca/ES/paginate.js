
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null, // 'https://www.campoluzenoteca.com/buscar?controller=search&orderby=position&orderway=desc&search_query={searchTerms}&p={page}',
    country: 'ES',
    store: 'campoluzenoteca',
    nextLinkSelector: '#pagination_next > a:not(.a-disabled)', // '#pagination_next > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#center_column .row',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition:
    {
      template: 'https://www.campoluzenoteca.com/buscar?controller=search&orderby=position&orderway=desc&search_query={searchTerms}&p={page}',
    },
    domain: 'campoluzenoteca.com',
    zipcode: '',
  },
};
