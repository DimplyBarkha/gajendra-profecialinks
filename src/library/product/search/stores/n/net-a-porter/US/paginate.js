
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'net-a-porter',
    nextLinkSelector: '#noPagination',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   template: 'https://www.net-a-porter.com/en-us/shop/search/{queryParams}&pageNumber={page}',
    // },
    zipcode: '',
    domain: 'net-a-porter.com',
  },
};
