
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'shoprite_08096',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://shop.shoprite.com/store/c977694/search?query={searchTerms}&page={page}',
    },
    domain: 'shoprite.com',
    zipcode: '',
  },
};
