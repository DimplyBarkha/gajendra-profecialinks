
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'shop-apotheke',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.rating-list-wrapper',
    loadedXpath: null,
    noResultsXPath: '//div[@class="text-center text-block"]/h1[contains(text(), 404)]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'shop-apotheke.com',
    zipcode: '',
  },
};
