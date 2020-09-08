
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    nextLinkSelector: 'li[class="andes-pagination__button andes-pagination__button--next"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class="ui-search-results"] , div[class="ui-search-main"]',
    noResultsXPath: '//div[contains(@class , "ui-search-rescue")]',
    openSearchDefinition: null,
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
};
