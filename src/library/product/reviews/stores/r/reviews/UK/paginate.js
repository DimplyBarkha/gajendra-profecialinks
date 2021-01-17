
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'reviews',
    nextLinkSelector: null,
    nextLinkXpath: '//ul[@class="pagination"]//li/a[contains(text(),"»")]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.StorePage__content',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'reviews.co.uk',
    zipcode: '',
  },
};
