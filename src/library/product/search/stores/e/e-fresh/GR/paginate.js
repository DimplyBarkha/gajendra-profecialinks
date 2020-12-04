
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'GR',
    store: 'e-fresh',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.row.products > div.product',
    loadedXpath: null,
    noResultsXPath: '//div[@class="message"] | //h6[contains(text(), "Error")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.e-fresh.gr/el/search?page={page}&q={searchTerms}&order=relevant',
    },
    domain: 'e-fresh.gr',
    zipcode: '',
  },
};
