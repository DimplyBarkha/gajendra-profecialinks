
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'tractorsupplyco',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.TSC_search_page_contents row m-0 plp-wrapper',
    loadedXpath: null,
    noResultsXPath: 'p.mb-3',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'tractorsupply.com',
    zipcode: '',
  },
};
