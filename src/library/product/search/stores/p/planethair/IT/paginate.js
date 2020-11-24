
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.grid-list',
    loadedXpath: null,
    noResultsXPath: '//p[contains(@class, "no-items")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.planethair.it/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q={searchTerms}&dispatch=products.search&page={page}',
    },
    domain: 'planethair.it',
    zipcode: '',
  },
};
