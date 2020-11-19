
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AR',
    store: 'mercadolibre',
    nextLinkSelector: 'li[class*="button--next"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.ui-search-results',
    noResultsXPath: '//div[@class="ui-search"]/div[contains(@class, "rescue")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mercadolibre.com.ar',
    zipcode: '',
  },
};
