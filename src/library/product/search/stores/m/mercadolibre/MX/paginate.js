
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'MX',
    store: 'mercadolibre',
    // nextLinkSelector: 'li.andes-pagination__button.andes-pagination__button--next',
    nextLinkXpath: "//li[@class='andes-pagination__button andes-pagination__button--next']/a[@class='andes-pagination__link ui-search-link']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: "//div[@class='ui-search-rescue__info']",
    // stopConditionSelectorOrXpath: "//div[@class='ui-search-rescue__info']",
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://mercadolibre.com.mx/{searchTerms}_Desde_{page}',
    // },
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
};
