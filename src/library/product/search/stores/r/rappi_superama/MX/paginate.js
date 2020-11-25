module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'Rappi_Superama',
    // nextLinkSelector: null,
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.products-container',
    //loadedXpath: null,
    //noResultsXPath: '//div[@class="no-results ng-star-inserted"]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'rappi.com.mx',
    zipcode: '',
  },
};

